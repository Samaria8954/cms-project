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
// GET - ACTIVE PAGES / TRASH PAGES
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trash = searchParams.get("trash") === "true";

    const pages = await prisma.page.findMany({
      where: trash
        ? { status: "trash" }
        : { status: { not: "trash" } },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET PAGES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pages.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - CREATE NEW PAGE
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      menuLabel,
      slug,
      seoTitle,
      metaDescription,
      focusKeyword,
      customHtml,
      customCss,
      customJs,
      status,
      featuredImage,
    } = body;

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        { error: "Page title is required." },
        { status: 400 }
      );
    }

    if (!slug || !String(slug).trim()) {
      return NextResponse.json(
        { error: "Page slug is required." },
        { status: 400 }
      );
    }

    const cleanTitle = String(title).trim();
    const cleanSlug = String(slug).trim();

    const cleanMenuLabel =
      typeof menuLabel === "string" && menuLabel.trim()
        ? menuLabel.trim()
        : cleanTitle;

    const cleanSeoTitle =
      typeof seoTitle === "string" && seoTitle.trim()
        ? seoTitle.trim()
        : null;

    const cleanMetaDescription =
      typeof metaDescription === "string" && metaDescription.trim()
        ? metaDescription.trim()
        : null;

    const cleanFocusKeyword =
      typeof focusKeyword === "string" && focusKeyword.trim()
        ? focusKeyword.trim()
        : null;

    const cleanHtml =
      typeof customHtml === "string" ? customHtml : "";

    const cleanCss =
      typeof customCss === "string" ? customCss : "";

    const cleanJs =
      typeof customJs === "string" ? customJs : "";

    const cleanStatus =
      status === "published" ? "published" : "draft";

    const cleanFeaturedImage =
      typeof featuredImage === "string" && featuredImage.trim()
        ? featuredImage.trim()
        : null;

    const existingPage = await prisma.page.findUnique({
      where: {
        slug: cleanSlug,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        {
          error: "A page with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const page = await prisma.page.create({
      data: {
        title: cleanTitle,
        menuLabel: cleanMenuLabel,
        slug: cleanSlug,
        seoTitle: cleanSeoTitle,
        metaDescription: cleanMetaDescription,
        focusKeyword: cleanFocusKeyword,
        customHtml: cleanHtml,
        customCss: cleanCss,
        customJs: cleanJs,
        featuredImage: cleanFeaturedImage,
        status: cleanStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: page.id,
        page,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PAGE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create page.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}