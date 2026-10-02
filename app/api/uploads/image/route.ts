import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    // =====================================================
    // CHECK FILE
    // =====================================================

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file received.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // ALLOWED IMAGE TYPES
    // =====================================================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, GIF, WEBP and SVG images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FILE SIZE - 5 MB
    // =====================================================

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "Image size must be less than 5MB.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // READ FILE
    // =====================================================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // =====================================================
    // GET EXTENSION
    // =====================================================

    let extension =
      path.extname(
        file.name
      ).toLowerCase();

    if (!extension) {
      extension =
        getExtension(
          file.type
        );
    }

    // =====================================================
    // GENERATE UNIQUE FILE NAME
    // =====================================================

    const filename =
      `${randomUUID()}${extension}`;

    // =====================================================
    // UPLOAD DIRECTORY
    // =====================================================

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    // Create folder
    await mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );

    // =====================================================
    // FILE PATH
    // =====================================================

    const filePath =
      path.join(
        uploadDirectory,
        filename
      );

    // =====================================================
    // SAVE IMAGE
    // =====================================================

    await writeFile(
      filePath,
      buffer
    );

    // =====================================================
    // PUBLIC URL
    // =====================================================

    const imageUrl =
      `/uploads/${filename}`;

    console.log(
      "EDITOR IMAGE UPLOADED:",
      {
        originalName:
          file.name,

        filename,

        filePath,

        imageUrl,
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        url: imageUrl,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "EDITOR IMAGE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload image.",

        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// MIME TYPE → EXTENSION
// =========================================================

function getExtension(
  mimeType: string
) {
  const extensions: Record<
    string,
    string
  > = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };

  return (
    extensions[mimeType] ||
    ".jpg"
  );
}