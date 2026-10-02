import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // 5MB limit
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Image size must be less than 5MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    // Create uploads folder if it doesn't exist
    await mkdir(uploadDir, {
      recursive: true,
    });

    // Get extension
    const originalName = file.name;

    const extension =
      path.extname(originalName).toLowerCase() || ".jpg";

    // Generate unique filename
    const filename =
      `${Date.now()}-${crypto.randomUUID()}${extension}`;

    const filePath = path.join(
      uploadDir,
      filename
    );

    // Save file
    await writeFile(
      filePath,
      buffer
    );

    // Public URL
    const imageUrl =
      `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });

  } catch (error) {
    console.error(
      "IMAGE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}