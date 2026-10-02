import { NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  try {
    const [pages, menus] = await Promise.all([
      prisma.page.count(),
      prisma.menu.count(),
    ]);

    return NextResponse.json({
      pages,
      posts: 0,
      menus,
      components: 0,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}