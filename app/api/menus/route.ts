import { NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// GET ALL MENUS
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
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
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("GET MENUS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch menus.",
      },
      {
        status: 500,
      }
    );
  }
}


// CREATE MENU
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Menu name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate menu name
    const existingName = await prisma.menu.findUnique({
      where: {
        name,
      },
    });

    if (existingName) {
      return NextResponse.json(
        {
          error: "A menu with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Check duplicate location
    if (location) {
      const existingLocation =
        await prisma.menu.findUnique({
          where: {
            location,
          },
        });

      if (existingLocation) {
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

    const menu = await prisma.menu.create({
      data: {
        name,
        location: location || null,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(menu, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE MENU ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create menu.",
      },
      {
        status: 500,
      }
    );
  }
}