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
    itemid: string;
  }>;
};

// =====================================================
// HELPERS
// =====================================================

async function getDescendantIds(
  rootId: number,
  menuId: number
): Promise<number[]> {
  const result: number[] = [];
  let parentIds = [rootId];

  while (parentIds.length > 0) {
    const children = await prisma.menuItem.findMany({
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

    const childIds = children.map((child) => child.id);

    if (childIds.length === 0) {
      break;
    }

    result.push(...childIds);
    parentIds = childIds;
  }

  return result;
}

async function getTreeIds(
  rootId: number,
  menuId: number
): Promise<number[]> {
  const descendants = await getDescendantIds(rootId, menuId);
  return [rootId, ...descendants];
}

// =====================================================
// GET SINGLE MENU ITEM
//
// ?trash=true can be used when the item is needed from
// the Trash.
// =====================================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemid } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemid);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid menu or menu item ID.",
        },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const includeTrash = url.searchParams.get("trash") === "true";

    const item = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId,
        ...(includeTrash ? {} : { deletedAt: null }),
      },
      include: {
        page: true,
        children: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: "Menu item not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch menu item.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// UPDATE MENU ITEM
// =====================================================

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemid } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemid);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid menu or menu item ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      url,
      pageId,
      parentId,
      sortOrder,
      status,
      megaMenu,
    } = body;

    const existingItem = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId,
        deletedAt: null,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        {
          error: "Menu item not found.",
        },
        { status: 404 }
      );
    }

    // =================================================
    // TITLE VALIDATION
    // =================================================

    if (
      title !== undefined &&
      !String(title).trim()
    ) {
      return NextResponse.json(
        {
          error: "Menu item title is required.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // PAGE VALIDATION
    // =================================================

    let validPageId: number | null = existingItem.pageId;

    if (pageId !== undefined) {
      if (pageId === null || pageId === "") {
        validPageId = null;
      } else {
        const parsedPageId = Number(pageId);

        if (
          !Number.isInteger(parsedPageId) ||
          parsedPageId <= 0
        ) {
          return NextResponse.json(
            {
              error: "Invalid page ID.",
            },
            { status: 400 }
          );
        }

        const page = await prisma.page.findUnique({
          where: {
            id: parsedPageId,
          },
        });

        if (!page) {
          return NextResponse.json(
            {
              error: "Selected page does not exist.",
            },
            { status: 404 }
          );
        }

        validPageId = parsedPageId;
      }
    }

    // =================================================
    // PARENT VALIDATION
    // =================================================

    let validParentId: number | null = existingItem.parentId;

    if (parentId !== undefined) {
      if (parentId === null || parentId === "") {
        validParentId = null;
      } else {
        const parsedParentId = Number(parentId);

        if (
          !Number.isInteger(parsedParentId) ||
          parsedParentId <= 0
        ) {
          return NextResponse.json(
            {
              error: "Invalid parent menu item.",
            },
            { status: 400 }
          );
        }

        if (parsedParentId === menuItemId) {
          return NextResponse.json(
            {
              error: "A menu item cannot be its own parent.",
            },
            { status: 400 }
          );
        }

        const parent = await prisma.menuItem.findFirst({
          where: {
            id: parsedParentId,
            menuId,
            deletedAt: null,
          },
        });

        if (!parent) {
          return NextResponse.json(
            {
              error: "Parent menu item not found.",
            },
            { status: 404 }
          );
        }

        // Prevent circular parent relationship.
        let currentParentId = parent.parentId;

        while (currentParentId !== null) {
          if (currentParentId === menuItemId) {
            return NextResponse.json(
              {
                error: "Invalid parent relationship.",
              },
              { status: 400 }
            );
          }

          const currentParent =
            await prisma.menuItem.findFirst({
              where: {
                id: currentParentId,
                menuId,
              },
              select: {
                parentId: true,
              },
            });

          if (!currentParent) {
            break;
          }

          currentParentId = currentParent.parentId;
        }

        validParentId = parsedParentId;
      }
    }

    // =================================================
    // UPDATE
    // =================================================

    const updated = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: {
        title:
          title !== undefined
            ? String(title).trim()
            : existingItem.title,

        url:
          url !== undefined
            ? url
              ? String(url).trim()
              : null
            : existingItem.url,

        pageId: validPageId,

        parentId: validParentId,

        sortOrder:
          sortOrder !== undefined
            ? Number(sortOrder) || 0
            : existingItem.sortOrder,

        status:
          status !== undefined
            ? String(status)
            : existingItem.status,

        megaMenu:
          megaMenu !== undefined
            ? Boolean(megaMenu)
            : existingItem.megaMenu,
      },
      include: {
        page: true,
        children: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully.",
      item: updated,
    });
  } catch (error) {
    console.error("UPDATE MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update menu item.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST
//
// Restore a trashed menu item.
//
// POST /api/menus/:menuId/items/:itemId
// body: { "action": "restore" }
// =====================================================

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemid } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemid);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid menu or menu item ID.",
        },
        { status: 400 }
      );
    }

    let body: { action?: string } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (body.action !== "restore") {
      return NextResponse.json(
        {
          error: "Invalid action. Use action: restore.",
        },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId,
        deletedAt: {
          not: null,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: "Trashed menu item not found.",
        },
        { status: 404 }
      );
    }

    const treeIds = await getTreeIds(menuItemId, menuId);

    // Restore only the trashed nodes in this item's tree.
    // This prevents accidentally restoring unrelated items.
    await prisma.menuItem.updateMany({
      where: {
        id: {
          in: treeIds,
        },
        menuId,
      },
      data: {
        deletedAt: null,
      },
    });

    const restored = await prisma.menuItem.findUnique({
      where: {
        id: menuItemId,
      },
      include: {
        page: true,
        children: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu item restored successfully.",
      item: restored,
      restoredIds: treeIds,
    });
  } catch (error) {
    console.error("RESTORE MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to restore menu item.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE MENU ITEM
//
// Default:
//   Soft delete -> Trash
//
// Permanent:
//   DELETE ...?permanent=true
// =====================================================

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemid } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemid);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid menu or menu item ID.",
        },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const permanent =
      url.searchParams.get("permanent") === "true";

    // =================================================
    // FIND ITEM
    // =================================================

    const item = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId,
        ...(permanent ? {} : { deletedAt: null }),
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          error: permanent
            ? "Menu item not found."
            : "Active menu item not found.",
        },
        { status: 404 }
      );
    }

    // =================================================
    // PERMANENT DELETE
    // =================================================

    if (permanent) {
      await prisma.menuItem.delete({
        where: {
          id: menuItemId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Menu item permanently deleted.",
        deletedId: menuItemId,
      });
    }

    // =================================================
    // MOVE TO TRASH
    //
    // Soft-delete the complete subtree.
    // Nothing is physically deleted.
    // =================================================

    const treeIds = await getTreeIds(menuItemId, menuId);

    await prisma.menuItem.updateMany({
      where: {
        id: {
          in: treeIds,
        },
        menuId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu item moved to Trash.",
      deletedId: menuItemId,
      trashedIds: treeIds,
    });
  } catch (error) {
    console.error("DELETE MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to process menu item deletion.",
      },
      { status: 500 }
    );
  }
}