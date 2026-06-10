import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const promosDir = path.join(process.cwd(), "content", "promos");

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(request, { params }) {
  try {
    const { filename } = await params;
    const decoded = decodeURIComponent(filename);

    if (decoded.includes("..") || decoded.includes("/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const filePath = path.join(promosDir, decoded);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(decoded).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const buffer = fs.readFileSync(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
