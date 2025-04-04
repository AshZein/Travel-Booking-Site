import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import path from "path";
import fs from "fs/promises";
import { writeFile } from "fs/promises";

// Enable multipart form parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read the incoming form data (works with Edge runtime off)
import { Readable } from "stream";

async function readFileFromRequest(req: Request): Promise<Buffer> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("No body found in request");

  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    // ✅ Token validation
    const token = verifyToken(req);
    if (!token || !token.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const extension = file.type === "image/jpeg" ? "jpg" : "png";
    const fileName = `${token.userId}.${extension}`;
    const filePath = path.join(process.cwd(), "public", "images", "users", fileName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, fileName });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Failed to upload file" }, { status: 500 });
  }
}