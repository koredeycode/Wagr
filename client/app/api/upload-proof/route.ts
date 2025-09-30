// app/api/proofs/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { proof } from "@/lib/schema";
import { v2 as cloudinary } from "cloudinary";
import type { File } from "formidable";
import formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Allow formidable to handle multipart form-data
export const config = {
  api: { bodyParser: false },
};

// helper to wrap formidable in a Promise
function parseForm(
  req: any
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const headers = await import("next/headers").then((m) => m.headers());
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse multipart form
    const { fields, files } = await parseForm((req as any).req);

    function fieldToString(v: string | string[] | undefined): string {
      if (!v) throw new Error("Missing required field");
      return Array.isArray(v) ? v[0] : v;
    }
    function getSingleFile(f: File | File[] | undefined): File {
      if (!f) throw new Error("File is missing");
      return Array.isArray(f) ? f[0] : f;
    }

    const wagerId = fieldToString(fields.wagerId);
    const notifiedUserAddr = fieldToString(fields.notifiedUserAddr);
    const uploaderAddr = fieldToString(fields.uploaderAddr);
    const text = fieldToString(fields.text);
    const file = getSingleFile(files.proof);

    // const wagerId = fields.wagerId as string;
    // const notifiedUserAddr = fields.notifiedUserAddr as string;
    // const uploaderAddr = fields.uploaderAddr as string;
    // const text = fields.text as string;
    // const file = files.proof as formidable.File;

    if (!file || !file.filepath) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1️⃣ Upload file to Cloudinary
    const uploaded = await cloudinary.uploader.upload(file.filepath, {
      folder: "proofs",
    });
    const imageUrl = uploaded.secure_url;

    // 2️⃣ Save proof in DB (return inserted row)
    const [created] = await db
      .insert(proof)
      .values({
        wagerId,
        uploaderId: session.user.id,
        text,
        imageUrl,
      })
      .returning();

    // 3️⃣ Notify backend to send email + socket notification
    await fetch(`${process.env.BACKEND_SERVER_URL}/proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "proofUploaded",
        data: {
          id: created.id,
          wagerId,
          userId: session.user.id,
          uploaderAddr,
          notifiedUserAddr,
          url: imageUrl,
          text,
        },
      }),
    });

    return NextResponse.json(
      { message: "Proof uploaded", proofId: created.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload-proof error:", error);
    return NextResponse.json({ error: "Proof upload failed" }, { status: 500 });
  }
}
