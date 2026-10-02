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

// =====================================================
// GET MENU ITEMS
// GET /api/menus/:menuId/items
// =====================================================

export async function GET(
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

    const items = await prisma.menuItem.findMany({
      where: {
        menuId: menuId,
      },
      include: {
        page: true,
        children: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET MENU ITEMS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch menu items." },
      { status: 500 }
    );
  }
}

// =====================================================
// CREATE MENU ITEM
// POST /api/menus/:menuId/items
// =====================================================

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

    // Check menu exists
    const menu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu not found." },
        { status: 404 }
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

    // Validate title
    if (!title || !String(title).trim()) {
      return NextResponse.json(
        { error: "Menu item title is required." },
        { status: 400 }
      );
    }

    // =================================================
    // PAGE VALIDATION
    // =================================================

    let validPageId: number | null = null;

    if (pageId !== undefined && pageId !== null && pageId !== "") {
      const parsedPageId = Number(pageId);

      if (
        !Number.isInteger(parsedPageId) ||
        parsedPageId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid page ID." },
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
          { error: "Selected page does not exist." },
          { status: 404 }
        );
      }

      validPageId = parsedPageId;
    }

    // =================================================
    // PARENT VALIDATION
    // =================================================

    let validParentId: number | null = null;

    if (
      parentId !== undefined &&
      parentId !== null &&
      parentId !== ""
    ) {
      const parsedParentId = Number(parentId);

      if (
        !Number.isInteger(parsedParentId) ||
        parsedParentId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid parent menu item ID." },
          { status: 400 }
        );
      }

      const parent = await prisma.menuItem.findUnique({
        where: {
          id: parsedParentId,
        },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Parent menu item not found." },
          { status: 404 }
        );
      }

      if (parent.menuId !== menuId) {
        return NextResponse.json(
          {
            error: "Parent must belong to the same menu.",
          },
          { status: 400 }
        );
      }

      validParentId = parsedParentId;
    }

    // =================================================
    // CREATE
    // =================================================

    const createdItem = await prisma.menuItem.create({
      data: {
        menuId: menuId,

        title: String(title).trim(),

        url:
          url !== undefined && url !== null && url !== ""
            ? String(url).trim()
            : null,

        pageId: validPageId,

        parentId: validParentId,

        sortOrder:
          sortOrder !== undefined
            ? Number(sortOrder) || 0
            : 0,

        status:
          status !== undefined
            ? String(status)
            : "published",

        megaMenu:
          megaMenu !== undefined
            ? Boolean(megaMenu)
            : false,
      },

      include: {
        page: true,
        children: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Menu item created successfully.",
        item: createdItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE MENU ITEM ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create menu item." },
      { status: 500 }
    );
  }
}