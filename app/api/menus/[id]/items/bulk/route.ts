import { NextResponse } from "next/server";

import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type DraftNewItem = {
  clientId: number;
  title: string;
  type?: string;
  url?: string | null;
  pageId?: number | null;
  parentId?: number | null;
  sortOrder?: number;
  status?: string;
  megaMenu?: boolean;
};

type DraftChange = {
  id: number;
  title?: string;
  url?: string | null;
  pageId?: number | null;
  parentId?: number | null;
  sortOrder?: number;
  status?: string;
  megaMenu?: boolean;
};

type BulkSaveBody = {
  menu?: {
    name?: string;
    location?: string | null;
  };
  newItems?: DraftNewItem[];
  changes?: DraftChange[];
  trashIds?: number[];
  permanentDeleteIds?: number[];
};

function asPositiveInt(value: unknown): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

type MenuItemDb = Pick<PrismaClient, "menuItem">;

async function getDescendantIds(
  tx: MenuItemDb,
  rootId: number,
  menuId: number
): Promise<number[]> {
  const result: number[] = [];
  let parentIds = [rootId];

  while (parentIds.length > 0) {
    const children = await tx.menuItem.findMany({
      where: {
        menuId,
        parentId: {
          in: parentIds,
        },
      },
      select: {
        id: true,
      },
    });

    const childIds = children.map((child: { id: number }) => child.id);

    if (childIds.length === 0) break;

    result.push(...childIds);
    parentIds = childIds;
  }

  return result;
}

async function getTreeIds(
  tx: MenuItemDb,
  rootId: number,
  menuId: number
): Promise<number[]> {
  const descendants = await getDescendantIds(tx, rootId, menuId);
  return [rootId, ...descendants];
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const menuId = Number(id);

    if (!Number.isInteger(menuId) || menuId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu ID." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as BulkSaveBody;

    const menuName = String(body.menu?.name ?? "").trim();

    if (!menuName) {
      return NextResponse.json(
        { error: "Menu name is required." },
        { status: 400 }
      );
    }

    const newItems = Array.isArray(body.newItems)
      ? body.newItems
      : [];

    const changes = Array.isArray(body.changes)
      ? body.changes
      : [];

    const trashIds = Array.isArray(body.trashIds)
      ? [...new Set(body.trashIds.map(Number).filter((id) => id > 0))]
      : [];

    const permanentDeleteIds = Array.isArray(body.permanentDeleteIds)
      ? [
          ...new Set(
            body.permanentDeleteIds
              .map(Number)
              .filter((id) => id > 0)
          ),
        ]
      : [];

    const result = await prisma.$transaction(async (tx) => {
      const menu = await tx.menu.findUnique({
        where: { id: menuId },
      });

      if (!menu) {
        throw new Error("Menu not found.");
      }

      // 1. Save menu settings in the same transaction.
      await tx.menu.update({
        where: { id: menuId },
        data: {
          name: menuName,
          location:
            body.menu?.location?.trim() || null,
        },
      });

      // 2. Create draft items. New child items can reference another
      // new item by its temporary negative clientId.
      const clientIdMap = new Map<number, number>();
      const remaining = [...newItems];

      while (remaining.length > 0) {
        const readyIndex = remaining.findIndex((item) => {
          const parentId = item.parentId ?? null;

          if (parentId === null || parentId >= 0) return true;

          return clientIdMap.has(parentId);
        });

        if (readyIndex === -1) {
          throw new Error(
            "Unable to resolve the parent relationship for a new menu item."
          );
        }

        const draft = remaining.splice(readyIndex, 1)[0];

        const pageId =
          draft.pageId === null || draft.pageId === undefined
            ? null
            : asPositiveInt(draft.pageId);

        if (draft.pageId !== null && draft.pageId !== undefined && pageId === null) {
          throw new Error(`Invalid page ID for "${draft.title}".`);
        }

        if (pageId !== null) {
          const page = await tx.page.findUnique({
            where: { id: pageId },
            select: { id: true },
          });

          if (!page) {
            throw new Error(`Selected page does not exist for "${draft.title}".`);
          }
        }

        let parentId: number | null = null;
        const draftParentId = draft.parentId ?? null;

        if (draftParentId !== null) {
          if (draftParentId < 0) {
            parentId = clientIdMap.get(draftParentId) ?? null;
          } else {
            parentId = asPositiveInt(draftParentId);

            if (parentId === null) {
              throw new Error(`Invalid parent for "${draft.title}".`);
            }

            const parent = await tx.menuItem.findFirst({
              where: {
                id: parentId,
                menuId,
                deletedAt: null,
              },
              select: { id: true },
            });

            if (!parent) {
              throw new Error(`Parent menu item not found for "${draft.title}".`);
            }
          }
        }

        const created = await tx.menuItem.create({
          data: {
            menuId,
            title: String(draft.title ?? "").trim(),
            type: String(draft.type ?? "page"),
            url:
              draft.url === undefined || draft.url === null
                ? null
                : String(draft.url).trim() || null,
            pageId,
            parentId,
            sortOrder: Number(draft.sortOrder) || 0,
            status: String(draft.status ?? "active"),
            megaMenu: Boolean(draft.megaMenu),
          },
        });

        clientIdMap.set(draft.clientId, created.id);
      }

      // 3. Update existing items. All of these happen inside the same
      // transaction instead of separate HTTP requests.
      for (const change of changes) {
        const itemId = asPositiveInt(change.id);
        if (itemId === null) continue;

        const existing = await tx.menuItem.findFirst({
          where: {
            id: itemId,
            menuId,
            deletedAt: null,
          },
        });

        if (!existing) {
          throw new Error(`Menu item ${itemId} was not found.`);
        }

        const parentId: number | null =
          change.parentId === undefined
            ? existing.parentId
            : change.parentId === null
              ? null
              : change.parentId < 0
                ? clientIdMap.get(change.parentId) ?? null
                : asPositiveInt(change.parentId);

        if (change.parentId !== undefined && change.parentId !== null && parentId === null) {
          throw new Error(`Invalid parent for menu item ${itemId}.`);
        }

        if (parentId === itemId) {
          throw new Error("A menu item cannot be its own parent.");
        }

        if (parentId !== null) {
          const parent = await tx.menuItem.findFirst({
            where: {
              id: parentId,
              menuId,
              deletedAt: null,
            },
            select: {
              id: true,
            },
          });

          if (!parent) {
            throw new Error(`Parent menu item not found for item ${itemId}.`);
          }

          let currentParentId: number | null = parent.id;
          const visited = new Set<number>();

          while (currentParentId !== null) {
            if (currentParentId === itemId) {
              throw new Error("Invalid circular parent relationship.");
            }

            if (visited.has(currentParentId)) break;
            visited.add(currentParentId);

            const parentRow: { parentId: number | null } | null =
              await tx.menuItem.findUnique({
                where: { id: currentParentId },
                select: { parentId: true },
              });

            currentParentId = parentRow?.parentId ?? null;
          }
        }

        await tx.menuItem.update({
          where: { id: itemId },
          data: {
            ...(change.title !== undefined
              ? { title: String(change.title).trim() }
              : {}),
            ...(change.url !== undefined
              ? {
                  url:
                    change.url === null
                      ? null
                      : String(change.url).trim() || null,
                }
              : {}),
            ...(change.pageId !== undefined
              ? {
                  pageId:
                    change.pageId === null
                      ? null
                      : asPositiveInt(change.pageId),
                }
              : {}),
            ...(change.parentId !== undefined
              ? { parentId }
              : {}),
            ...(change.sortOrder !== undefined
              ? { sortOrder: Number(change.sortOrder) || 0 }
              : {}),
            ...(change.status !== undefined
              ? { status: String(change.status) }
              : {}),
            ...(change.megaMenu !== undefined
              ? { megaMenu: Boolean(change.megaMenu) }
              : {}),
          },
        });
      }

      // 4. Soft-delete complete subtrees.
      const trashedIds = new Set<number>();

      for (const rootId of trashIds) {
        const item = await tx.menuItem.findFirst({
          where: {
            id: rootId,
            menuId,
            deletedAt: null,
          },
          select: { id: true },
        });

        if (!item) continue;

        const treeIds = await getTreeIds(tx, rootId, menuId);
        treeIds.forEach((id) => trashedIds.add(id));

        await tx.menuItem.updateMany({
          where: {
            id: { in: treeIds },
            menuId,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }

      // 5. Permanently delete requested trash roots.
      // Database relation cascade removes their descendants.
      for (const rootId of permanentDeleteIds) {
        const item = await tx.menuItem.findFirst({
          where: {
            id: rootId,
            menuId,
          },
          select: { id: true },
        });

        if (!item) continue;

        await tx.menuItem.delete({
          where: { id: rootId },
        });
      }

      return {
        created: clientIdMap.size,
        updated: changes.length,
        trashed: trashedIds.size,
        permanentlyDeleted: permanentDeleteIds.length,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Menu changes saved successfully.",
      ...result,
    });
  } catch (error) {
    console.error("BULK SAVE MENU ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save menu changes.",
      },
      { status: 500 }
    );
  }
}
