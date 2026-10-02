import { NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});


// =====================================================
// GET MENU ITEMS
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const menuIdParam = searchParams.get("menuId");

    if (!menuIdParam) {
      return NextResponse.json(
        { error: "Menu ID is required." },
        { status: 400 }
      );
    }

    const menuId = Number(menuIdParam);

    if (Number.isNaN(menuId)) {
      return NextResponse.json(
        { error: "Invalid menu ID." },
        { status: 400 }
      );
    }

    const items = await prisma.menuItem.findMany({
      where: {
        menuId,
      },

      include: {
        page: true,
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
// ADD MENU ITEM
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      menuId,
      title,
      type = "page",
      url,
      pageId,
      parentId,
      sortOrder = 0,
      status = "active",
      megaMenu = false,
    } = body;

    const validMenuId = Number(menuId);

    if (!menuId || Number.isNaN(validMenuId)) {
      return NextResponse.json(
        { error: "Valid menu ID is required." },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Menu item title is required." },
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
        { error: "Menu does not exist." },
        { status: 404 }
      );
    }

    let validPageId: number | null = null;

    if (
      pageId !== undefined &&
      pageId !== null &&
      pageId !== ""
    ) {
      validPageId = Number(pageId);

      if (Number.isNaN(validPageId)) {
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
          { error: "Selected page does not exist." },
          { status: 404 }
        );
      }
    }

    let validParentId: number | null = null;

    if (
      parentId !== undefined &&
      parentId !== null &&
      parentId !== ""
    ) {
      validParentId = Number(parentId);

      if (Number.isNaN(validParentId)) {
        return NextResponse.json(
          { error: "Invalid parent menu item." },
          { status: 400 }
        );
      }

      const parent = await prisma.menuItem.findUnique({
        where: {
          id: validParentId,
        },
      });

      if (!parent || parent.menuId !== validMenuId) {
        return NextResponse.json(
          { error: "Invalid parent menu item." },
          { status: 400 }
        );
      }
    }

    if (validPageId !== null) {
      const existing = await prisma.menuItem.findFirst({
        where: {
          menuId: validMenuId,
          pageId: validPageId,
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            error: "This page is already added to this menu.",
          },
          { status: 409 }
        );
      }
    }

    const item = await prisma.menuItem.create({
      data: {
        menuId: validMenuId,
        title: title.trim(),
        type,
        url: url?.trim() || null,
        pageId: validPageId,
        parentId: validParentId,
        sortOrder: Number(sortOrder) || 0,
        status,
        megaMenu: Boolean(megaMenu),
      },

      include: {
        page: true,
      },
    });

    return NextResponse.json(item, {
      status: 201,
    });

  } catch (error) {
    console.error("CREATE MENU ITEM ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create menu item.",
      },
      { status: 500 }
    );
  }
}