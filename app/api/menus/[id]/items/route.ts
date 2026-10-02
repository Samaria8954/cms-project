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
    itemId: string;
  }>;
};

// =====================================================
// GET SINGLE MENU ITEM
// GET /api/menus/:menuId/items/:itemId
// =====================================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemId } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemId);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid menu or menu item ID." },
        { status: 400 }
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
        { error: "Menu item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("GET MENU ITEM ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch menu item." },
      { status: 500 }
    );
  }
}

// =====================================================
// UPDATE MENU ITEM
// PUT /api/menus/:menuId/items/:itemId
// =====================================================

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemId } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemId);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid menu or menu item ID." },
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

    // Find existing item
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId: menuId,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found." },
        { status: 404 }
      );
    }

    // Validate title
    if (
      title !== undefined &&
      (!title || !String(title).trim())
    ) {
      return NextResponse.json(
        { error: "Menu item title is required." },
        { status: 400 }
      );
    }

    // Page ID
    const validPageId =
      pageId !== undefined
        ? pageId
          ? Number(pageId)
          : null
        : existingItem.pageId;

    if (validPageId !== null) {
      if (
        !Number.isInteger(validPageId) ||
        validPageId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid page ID." },
          { status: 400 }
        );
      }

      const page = await prisma.page.findUnique({
        where: {
          id: validPageId,
        },
      });

      if (!page) {
        return NextResponse.json(
          { error: "Selected page not found." },
          { status: 404 }
        );
      }
    }

    // Parent ID
    const validParentId =
      parentId !== undefined
        ? parentId
          ? Number(parentId)
          : null
        : existingItem.parentId;

    if (validParentId !== null) {
      if (
        !Number.isInteger(validParentId) ||
        validParentId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid parent menu item ID." },
          { status: 400 }
        );
      }

      // Item cannot be its own parent
      if (validParentId === menuItemId) {
        return NextResponse.json(
          {
            error: "A menu item cannot be its own parent.",
          },
          { status: 400 }
        );
      }

      // Parent must belong to same menu
      const parent = await prisma.menuItem.findFirst({
        where: {
          id: validParentId,
          menuId: menuId,
        },
      });

      if (!parent) {
        return NextResponse.json(
          {
            error: "Parent menu item not found in this menu.",
          },
          { status: 404 }
        );
      }
    }

    // Update item
    const updatedItem = await prisma.menuItem.update({
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
      item: updatedItem,
    });
  } catch (error) {
    console.error("UPDATE MENU ITEM ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update menu item." },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE MENU ITEM
// DELETE /api/menus/:menuId/items/:itemId
// =====================================================

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, itemId } = await params;

    const menuId = Number(id);
    const menuItemId = Number(itemId);

    if (
      !Number.isInteger(menuId) ||
      menuId <= 0 ||
      !Number.isInteger(menuItemId) ||
      menuItemId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid menu or menu item ID." },
        { status: 400 }
      );
    }

    // Find item
    const item = await prisma.menuItem.findFirst({
      where: {
        id: menuItemId,
        menuId: menuId,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Menu item not found." },
        { status: 404 }
      );
    }

    // Find all children recursively
    const idsToDelete: number[] = [menuItemId];

    let parentIds: number[] = [menuItemId];

    while (parentIds.length > 0) {
      const children = await prisma.menuItem.findMany({
        where: {
          menuId: menuId,
          parentId: {
            in: parentIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (children.length === 0) {
        break;
      }

      const childIds = children.map(
        (child) => child.id
      );

      idsToDelete.push(...childIds);

      parentIds = childIds;
    }

    // Delete item + all children
    await prisma.$transaction(async (tx) => {
      await tx.menuItem.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
          menuId: menuId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully.",
      deletedId: menuItemId,
      deletedCount: idsToDelete.length,
    });
  } catch (error) {
    console.error("DELETE MENU ITEM ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete menu item." },
      { status: 500 }
    );
  }
}