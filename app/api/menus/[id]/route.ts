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
// GET SINGLE MENU
// GET /api/menus/:id
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
        {
          error: "Invalid menu ID.",
        },
        {
          status: 400,
        }
      );
    }

    const menu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
      include: {
        items: {
          include: {
            page: true,
            children: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!menu) {
      return NextResponse.json(
        {
          error: "Menu not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error("GET SINGLE MENU ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch menu.",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE MENU
// PUT /api/menus/:id
// =====================================================

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const menuId = Number(id);

    if (!Number.isInteger(menuId) || menuId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid menu ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : undefined;

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : undefined;

    // =================================================
    // FIND MENU
    // =================================================

    const existingMenu =
      await prisma.menu.findUnique({
        where: {
          id: menuId,
        },
      });

    if (!existingMenu) {
      return NextResponse.json(
        {
          error: "Menu not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // NAME VALIDATION
    // =================================================

    if (name !== undefined && !name) {
      return NextResponse.json(
        {
          error: "Menu name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CHECK DUPLICATE NAME
    // =================================================

    if (
      name !== undefined &&
      name !== existingMenu.name
    ) {
      const duplicateName =
        await prisma.menu.findFirst({
          where: {
            name: name,
            NOT: {
              id: menuId,
            },
          },
        });

      if (duplicateName) {
        return NextResponse.json(
          {
            error:
              "A menu with this name already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    // =================================================
    // CHECK DUPLICATE LOCATION
    // =================================================

    if (
      location !== undefined &&
      location &&
      location !== existingMenu.location
    ) {
      const duplicateLocation =
        await prisma.menu.findFirst({
          where: {
            location: location,
            NOT: {
              id: menuId,
            },
          },
        });

      if (duplicateLocation) {
        return NextResponse.json(
          {
            error:
              "A menu with this location already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    // =================================================
    // UPDATE
    // =================================================

    const updatedMenu =
      await prisma.menu.update({
        where: {
          id: menuId,
        },

        data: {
          name:
            name !== undefined
              ? name
              : existingMenu.name,

          location:
            location !== undefined
              ? location || null
              : existingMenu.location,
        },

        include: {
          items: {
            include: {
              page: true,
              children: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      message: "Menu updated successfully.",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("UPDATE MENU ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update menu.",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE MENU
// DELETE /api/menus/:id
// =====================================================

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const menuId = Number(id);

    if (!Number.isInteger(menuId) || menuId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid menu ID.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND MENU
    // =================================================

    const existingMenu =
      await prisma.menu.findUnique({
        where: {
          id: menuId,
        },
      });

    if (!existingMenu) {
      return NextResponse.json(
        {
          error: "Menu not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // DELETE MENU ITEMS
    // =================================================

    await prisma.menuItem.deleteMany({
      where: {
        menuId: menuId,
      },
    });

    // =================================================
    // DELETE MENU
    // =================================================

    await prisma.menu.delete({
      where: {
        id: menuId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu deleted successfully.",
      deletedId: menuId,
    });
  } catch (error) {
    console.error("DELETE MENU ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete menu.",
      },
      {
        status: 500,
      }
    );
  }
}