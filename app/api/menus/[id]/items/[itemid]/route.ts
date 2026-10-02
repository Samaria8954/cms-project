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
// GET SINGLE MENU ITEM
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
        {
          status: 400,
        }
      );
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId: menuId,
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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch menu item.",
      },
      {
        status: 500,
      }
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
        {
          status: 400,
        }
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

    // =================================================
    // FIND MENU ITEM
    // =================================================

    const existingItem =
      await prisma.menuItem.findFirst({
        where: {
          id: menuItemId,
          menuId: menuId,
        },
      });

    if (!existingItem) {
      return NextResponse.json(
        {
          error: "Menu item not found.",
        },
        {
          status: 404,
        }
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
        {
          status: 400,
        }
      );
    }

    // =================================================
    // PAGE VALIDATION
    // =================================================

    let validPageId: number | null =
      existingItem.pageId;

    if (pageId !== undefined) {
      if (
        pageId === null ||
        pageId === ""
      ) {
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
            {
              status: 400,
            }
          );
        }

        const page =
          await prisma.page.findUnique({
            where: {
              id: parsedPageId,
            },
          });

        if (!page) {
          return NextResponse.json(
            {
              error:
                "Selected page does not exist.",
            },
            {
              status: 404,
            }
          );
        }

        validPageId = parsedPageId;
      }
    }

    // =================================================
    // PARENT VALIDATION
    // =================================================

    let validParentId: number | null =
      existingItem.parentId;

    if (parentId !== undefined) {
      if (
        parentId === null ||
        parentId === ""
      ) {
        validParentId = null;
      } else {
        const parsedParentId =
          Number(parentId);

        if (
          !Number.isInteger(
            parsedParentId
          ) ||
          parsedParentId <= 0
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid parent menu item.",
            },
            {
              status: 400,
            }
          );
        }

        // Cannot be its own parent
        if (
          parsedParentId === menuItemId
        ) {
          return NextResponse.json(
            {
              error:
                "A menu item cannot be its own parent.",
            },
            {
              status: 400,
            }
          );
        }

        const parent =
          await prisma.menuItem.findUnique({
            where: {
              id: parsedParentId,
            },
          });

        if (!parent) {
          return NextResponse.json(
            {
              error:
                "Parent menu item not found.",
            },
            {
              status: 404,
            }
          );
        }

        // Parent must belong to same menu
        if (
          parent.menuId !== menuId
        ) {
          return NextResponse.json(
            {
              error:
                "Parent must belong to the same menu.",
            },
            {
              status: 400,
            }
          );
        }

        // Prevent circular parent relationship
        let currentParentId =
          parent.parentId;

        while (currentParentId !== null) {
          if (
            currentParentId === menuItemId
          ) {
            return NextResponse.json(
              {
                error:
                  "Invalid parent relationship.",
              },
              {
                status: 400,
              }
            );
          }

          const currentParent =
            await prisma.menuItem.findUnique({
              where: {
                id: currentParentId,
              },
              select: {
                parentId: true,
              },
            });

          if (!currentParent) {
            break;
          }

          currentParentId =
            currentParent.parentId;
        }

        validParentId = parsedParentId;
      }
    }

    // =================================================
    // UPDATE
    // =================================================

    const updated =
      await prisma.menuItem.update({
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
      message:
        "Menu item updated successfully.",
      item: updated,
    });
  } catch (error) {
    console.error(
      "UPDATE MENU ITEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update menu item.",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE MENU ITEM
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
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND ITEM
    // =================================================

    const item =
      await prisma.menuItem.findFirst({
        where: {
          id: menuItemId,
          menuId: menuId,
        },
        include: {
          children: true,
        },
      });

    if (!item) {
      return NextResponse.json(
        {
          error: "Menu item not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // DELETE CHILDREN FIRST
    // =================================================

    await prisma.menuItem.deleteMany({
      where: {
        parentId: menuItemId,
        menuId: menuId,
      },
    });

    // =================================================
    // DELETE ITEM
    // =================================================

    await prisma.menuItem.delete({
      where: {
        id: menuItemId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Menu item deleted successfully.",
      deletedId: menuItemId,
    });
  } catch (error) {
    console.error(
      "DELETE MENU ITEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete menu item.",
      },
      {
        status: 500,
      }
    );
  }
}