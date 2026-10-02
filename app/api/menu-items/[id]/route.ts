import { NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});


// GET SINGLE MENU ITEM
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID." },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.findUnique({
      where: {
        id: itemId,
      },

      include: {
        menu: true,
        page: true,
        parent: true,
        children: {
          orderBy: {
            sortOrder: "asc",
          },
        },
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


// UPDATE MENU ITEM
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID." },
        { status: 400 }
      );
    }

    const existingItem =
      await prisma.menuItem.findUnique({
        where: {
          id: itemId,
        },
      });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      type,
      url,
      pageId,
      parentId,
      sortOrder,
      status,
      megaMenu,
      menuId,
    } = body;


    // -----------------------------
    // TITLE
    // -----------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        { error: "Menu item title is required." },
        { status: 400 }
      );
    }


    // -----------------------------
    // TYPE
    // -----------------------------

    const validType =
      type === "custom"
        ? "custom"
        : "page";


    // -----------------------------
    // MENU
    // -----------------------------

    let validMenuId = existingItem.menuId;

    if (
      menuId !== undefined &&
      menuId !== null &&
      menuId !== ""
    ) {
      validMenuId = Number(menuId);

      if (
        !Number.isInteger(validMenuId) ||
        validMenuId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid menu ID." },
          { status: 400 }
        );
      }

      const menu = await prisma.menu.findUnique({
        where: {
          id: validMenuId,
        },
      });

      if (!menu) {
        return NextResponse.json(
          { error: "Selected menu does not exist." },
          { status: 404 }
        );
      }
    }


    // -----------------------------
    // PAGE
    // -----------------------------

    let validPageId: number | null = null;

    if (validType === "page") {
      if (
        pageId !== undefined &&
        pageId !== null &&
        pageId !== ""
      ) {
        validPageId = Number(pageId);

        if (
          !Number.isInteger(validPageId) ||
          validPageId <= 0
        ) {
          return NextResponse.json(
            { error: "Invalid page ID." },
            { status: 400 }
          );
        }

        const page =
          await prisma.page.findUnique({
            where: {
              id: validPageId,
            },
          });

        if (!page) {
          return NextResponse.json(
            { error: "Selected page does not exist." },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error:
              "Please select a page for this menu item.",
          },
          { status: 400 }
        );
      }
    }


    // -----------------------------
    // CUSTOM URL
    // -----------------------------

    let validUrl: string | null = null;

    if (validType === "custom") {
      if (
        typeof url !== "string" ||
        !url.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Please enter a URL for this menu item.",
          },
          { status: 400 }
        );
      }

      validUrl = url.trim();
    }


    // -----------------------------
    // PARENT
    // -----------------------------

    let validParentId: number | null = null;

    if (
      parentId !== undefined &&
      parentId !== null &&
      parentId !== ""
    ) {
      validParentId = Number(parentId);

      if (
        !Number.isInteger(validParentId) ||
        validParentId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid parent menu item." },
          { status: 400 }
        );
      }

      // Can't be its own parent
      if (validParentId === itemId) {
        return NextResponse.json(
          {
            error:
              "A menu item cannot be its own parent.",
          },
          { status: 400 }
        );
      }

      const parent =
        await prisma.menuItem.findUnique({
          where: {
            id: validParentId,
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

      // Parent must belong to same menu
      if (parent.menuId !== validMenuId) {
        return NextResponse.json(
          {
            error:
              "Parent item must belong to the same menu.",
          },
          { status: 400 }
        );
      }
    }


    // -----------------------------
    // SORT ORDER
    // -----------------------------

    let validSortOrder =
      existingItem.sortOrder;

    if (
      sortOrder !== undefined &&
      sortOrder !== null &&
      sortOrder !== ""
    ) {
      const parsedSortOrder = Number(sortOrder);

      if (
        !Number.isFinite(parsedSortOrder)
      ) {
        return NextResponse.json(
          { error: "Invalid sort order." },
          { status: 400 }
        );
      }

      validSortOrder = parsedSortOrder;
    }


    // -----------------------------
    // STATUS
    // -----------------------------

    const validStatus =
      status === "inactive"
        ? "inactive"
        : "active";


    // -----------------------------
    // MEGA MENU
    // -----------------------------

    const validMegaMenu =
      megaMenu !== undefined
        ? Boolean(megaMenu)
        : existingItem.megaMenu;


    // -----------------------------
    // UPDATE
    // -----------------------------

    const updated =
      await prisma.menuItem.update({
        where: {
          id: itemId,
        },

        data: {
          menuId: validMenuId,

          title: title.trim(),

          type: validType,

          url: validUrl,

          pageId: validPageId,

          parentId: validParentId,

          sortOrder: validSortOrder,

          status: validStatus,

          megaMenu: validMegaMenu,
        },

        include: {
          menu: true,
          page: true,
          parent: true,
          children: true,
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      "UPDATE MENU ITEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update menu item.",
      },
      { status: 500 }
    );
  }
}


// DELETE MENU ITEM
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID." },
        { status: 400 }
      );
    }

    const item =
      await prisma.menuItem.findUnique({
        where: {
          id: itemId,
        },
      });

    if (!item) {
      return NextResponse.json(
        { error: "Menu item not found." },
        { status: 404 }
      );
    }

    await prisma.menuItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({
      message:
        "Menu item deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE MENU ITEM ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete menu item.",
      },
      { status: 500 }
    );
  }
}