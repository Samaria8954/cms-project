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

// GET SINGLE PAGE

// =====================================================



export async function GET(

  request: Request,

  {

    params,

  }: {

    params: Promise<{ id: string }>;

  }

) {

  try {

    const { id } = await params;



    const pageId = Number(id);



    // =================================================

    // VALIDATE ID

    // =================================================



    if (Number.isNaN(pageId)) {

      return NextResponse.json(

        {

          error: "Invalid page ID.",

        },

        {

          status: 400,

        }

      );

    }



    // =================================================

    // GET PAGE

    // =================================================



    const page = await prisma.page.findUnique({

      where: {

        id: pageId,

      },

    });



    // =================================================

    // PAGE NOT FOUND

    // =================================================



    if (!page) {

      return NextResponse.json(

        {

          error: "Page not found.",

        },

        {

          status: 404,

        }

      );

    }



    // =================================================

    // SUCCESS

    // =================================================



    return NextResponse.json(

      {

        page,

      },

      {

        status: 200,

      }

    );

  } catch (error) {

    console.error("GET SINGLE PAGE ERROR:", error);



    return NextResponse.json(

      {

        error:

          error instanceof Error

            ? error.message

            : "Failed to fetch page.",

      },

      {

        status: 500,

      }

    );

  }

}



// =====================================================

// UPDATE PAGE

// =====================================================



export async function PUT(

  request: Request,

  {

    params,

  }: {

    params: Promise<{ id: string }>;

  }

) {

  try {

    const { id } = await params;



    const pageId = Number(id);



    // =================================================

    // VALIDATE ID

    // =================================================



    if (Number.isNaN(pageId)) {

      return NextResponse.json(

        {

          error: "Invalid page ID.",

        },

        {

          status: 400,

        }

      );

    }



    // =================================================

    // READ REQUEST BODY

    // =================================================



    const body = await request.json();



    const {

      title,

      menuLabel,

      slug,



      // =================================================

      // LEGACY / SUMMERNOTE CONTENT

      // =================================================



      content,



      // =================================================

      // ORDERED CONTENT BLOCKS

      // =================================================



      contentBlocks,



      // =================================================

      // CUSTOM CODE

      // =================================================



      customHtml,

      customCss,

      customJs,



      // =================================================

      // SEO

      // =================================================



      seoTitle,

      metaDescription,

      focusKeyword,



      // =================================================

      // OTHER

      // =================================================



      status,

      featuredImage,

    } = body;



    // =================================================

    // VALIDATE TITLE

    // =================================================



    if (

      typeof title !== "string" ||

      !title.trim()

    ) {

      return NextResponse.json(

        {

          error: "Page title is required.",

        },

        {

          status: 400,

        }

      );

    }



    // =================================================

    // VALIDATE SLUG

    // =================================================



    if (

      typeof slug !== "string" ||

      !slug.trim()

    ) {

      return NextResponse.json(

        {

          error: "Page slug is required.",

        },

        {

          status: 400,

        }

      );

    }



    // =================================================

    // CHECK PAGE EXISTS

    // =================================================



    const currentPage =

      await prisma.page.findUnique({

        where: {

          id: pageId,

        },

      });



    if (!currentPage) {

      return NextResponse.json(

        {

          error: "Page not found.",

        },

        {

          status: 404,

        }

      );

    }



    // =================================================

    // CLEAN SLUG

    // =================================================



    const cleanSlug = slug.trim();



    // =================================================

    // CHECK DUPLICATE SLUG

    // =================================================



    const existingPage =

      await prisma.page.findFirst({

        where: {

          slug: cleanSlug,

          NOT: {

            id: pageId,

          },

        },

      });



    if (existingPage) {

      return NextResponse.json(

        {

          error:

            "Another page already uses this slug.",

        },

        {

          status: 409,

        }

      );

    }



    // =================================================

    // CLEAN BASIC DATA

    // =================================================



    const cleanTitle = title.trim();



    const cleanMenuLabel =

      typeof menuLabel === "string" &&

      menuLabel.trim()

        ? menuLabel.trim()

        : null;



    // =================================================

    // SUMMERNOTE LEGACY CONTENT

    // =================================================



    const cleanContent =

      typeof content === "string"

        ? content

        : "";



    // =================================================

    // ORDERED CONTENT BLOCKS

    // =================================================



    let cleanContentBlocks = "[]";



    if (typeof contentBlocks === "string") {

      try {

        const parsedBlocks = JSON.parse(

          contentBlocks

        );



        if (Array.isArray(parsedBlocks)) {

          cleanContentBlocks =

            JSON.stringify(parsedBlocks);

        }

      } catch {

        return NextResponse.json(

          {

            error:

              "Invalid contentBlocks format.",

          },

          {

            status: 400,

          }

        );

      }

    } else if (Array.isArray(contentBlocks)) {

      cleanContentBlocks =

        JSON.stringify(contentBlocks);

    }



    // =================================================

    // CUSTOM HTML

    // =================================================



    const cleanCustomHtml =

      typeof customHtml === "string"

        ? customHtml

        : "";



    // =================================================

    // CUSTOM CSS

    // =================================================



    const cleanCustomCss =

      typeof customCss === "string"

        ? customCss

        : "";



    // =================================================

    // CUSTOM JAVASCRIPT

    // =================================================



    const cleanCustomJs =

      typeof customJs === "string"

        ? customJs

        : "";



    // =================================================

    // SEO TITLE

    // =================================================



    const cleanSeoTitle =

      typeof seoTitle === "string" &&

      seoTitle.trim()

        ? seoTitle.trim()

        : null;



    // =================================================

    // META DESCRIPTION

    // =================================================



    const cleanMetaDescription =

      typeof metaDescription === "string" &&

      metaDescription.trim()

        ? metaDescription.trim()

        : null;



    // =================================================

    // FOCUS KEYWORD

    // =================================================



    const cleanFocusKeyword =

      typeof focusKeyword === "string" &&

      focusKeyword.trim()

        ? focusKeyword.trim()

        : null;



    // =================================================

    // STATUS

    // =================================================



    const cleanStatus =

      typeof status === "string" &&

      status.trim()

        ? status.trim()

        : "draft";



    // =================================================

    // FEATURED IMAGE

    // =================================================



    const cleanFeaturedImage =

      typeof featuredImage === "string" &&

      featuredImage.trim()

        ? featuredImage.trim()

        : null;



    // =================================================

    // UPDATE DATABASE

    // =================================================



    const updatedPage =

      await prisma.page.update({

        where: {

          id: pageId,

        },



        data: {

          // -------------------------------------------

          // BASIC

          // -------------------------------------------



          title: cleanTitle,



          menuLabel:

            cleanMenuLabel,



          slug: cleanSlug,



          // -------------------------------------------

          // LEGACY SUMMERNOTE CONTENT

          // -------------------------------------------



          content: cleanContent,



          // -------------------------------------------

          // ORDERED CONTENT BLOCKS

          // -------------------------------------------



          contentBlocks:

            cleanContentBlocks,



          // -------------------------------------------

          // CUSTOM HTML

          // -------------------------------------------



          customHtml:

            cleanCustomHtml,



          // -------------------------------------------

          // CUSTOM CSS

          // -------------------------------------------



          customCss:

            cleanCustomCss,



          // -------------------------------------------

          // CUSTOM JAVASCRIPT

          // -------------------------------------------



          customJs:

            cleanCustomJs,



          // -------------------------------------------

          // SEO

          // -------------------------------------------



          seoTitle:

            cleanSeoTitle,



          metaDescription:

            cleanMetaDescription,



          focusKeyword:

            cleanFocusKeyword,



          // -------------------------------------------

          // STATUS

          // -------------------------------------------



          status:

            cleanStatus,



          // -------------------------------------------

          // FEATURED IMAGE

          // -------------------------------------------



          featuredImage:

            cleanFeaturedImage,

        },

      });



    // =================================================

    // SUCCESS

    // =================================================



    return NextResponse.json(

      {

        success: true,

        message: "Page updated successfully.",

        page: updatedPage,

      },

      {

        status: 200,

      }

    );

  } catch (error) {

    console.error("UPDATE PAGE ERROR:", error);



    // =================================================

    // PRISMA UNIQUE ERROR

    // =================================================



    if (

      error &&

      typeof error === "object" &&

      "code" in error &&

      error.code === "P2002"

    ) {

      return NextResponse.json(

        {

          error:

            "A page with this slug already exists.",

        },

        {

          status: 409,

        }

      );

    }



    return NextResponse.json(

      {

        error:

          error instanceof Error

            ? error.message

            : "Failed to update page.",

      },

      {

        status: 500,

      }

    );

  }

}



// =====================================================

// DELETE PAGE

// =====================================================



export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const pageId = Number(id);

    // =================================================
    // VALIDATE ID
    // =================================================

    if (Number.isNaN(pageId)) {
      return NextResponse.json(
        {
          error: "Invalid page ID.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CHECK PAGE
    // =================================================

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          error: "Page not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // PERMANENT DELETE
    // =================================================

    const url = new URL(request.url);
    const permanent = url.searchParams.get("permanent") === "true";

    if (permanent) {
      if (page.status !== "trash") {
        return NextResponse.json(
          {
            error: "Only pages already in Trash can be permanently deleted.",
          },
          {
            status: 400,
          }
        );
      }

      await prisma.page.delete({
        where: {
          id: pageId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Page permanently deleted.",
        },
        {
          status: 200,
        }
      );
    }

    // =================================================
    // MOVE TO TRASH
    // =================================================

    if (page.status === "trash") {
      return NextResponse.json(
        {
          error: "Page is already in Trash.",
        },
        {
          status: 400,
        }
      );
    }

    const trashedPage = await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        status: "trash",
      },
    });

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message: "Page moved to Trash.",
        page: trashedPage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE PAGE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete page.",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const pageId = Number(id);

    // =================================================
    // VALIDATE ID
    // =================================================

    if (Number.isNaN(pageId)) {
      return NextResponse.json(
        {
          error: "Invalid page ID.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // CHECK PAGE
    // =================================================

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          error: "Page not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json().catch(() => ({}));

    // =================================================
    // RESTORE
    // =================================================

    if (body.action === "restore") {
      if (page.status !== "trash") {
        return NextResponse.json(
          {
            error: "Only pages in Trash can be restored.",
          },
          {
            status: 400,
          }
        );
      }

      // The current Page model has no previous-status field,
      // so a restored page is returned as Draft.
      const restoredPage = await prisma.page.update({
        where: {
          id: pageId,
        },
        data: {
          status: "draft",
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Page restored successfully.",
          page: restoredPage,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Invalid action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("PATCH PAGE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update page.",
      },
      {
        status: 500,
      }
    );
  }
}
