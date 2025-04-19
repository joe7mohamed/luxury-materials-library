// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getCurrentUser } from "@/lib/auth/session";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Must be a supplier or admin to upload files
    if (user.userType !== "supplier" && user.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const allowed3DTypes = [
      "model/gltf-binary",
      "model/gltf+json",
      "application/octet-stream",
    ];

    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid image file type. Supported types: JPG, PNG, WebP, GIF",
        },
        { status: 400 }
      );
    }

    if (type === "3dmodel" && !allowed3DTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid 3D model file type. Supported types: GLTF, GLB, OBJ",
        },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (type === "3dmodel" && !["gltf", "glb", "obj"].includes(fileExt)) {
      return NextResponse.json(
        {
          error:
            "Invalid 3D model file extension. Supported extensions: gltf, glb, obj",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uuid = uuidv4();
    const filename = `${type}/${user.id}/${uuid}-${file.name}`;

    // Get buffer from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Generate URL
    const fileUrl = `${process.env.S3_URL_PREFIX}/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      filename: file.name,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
