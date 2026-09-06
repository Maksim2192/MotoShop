import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Файл не знайдено" },
        { status: 400 }
      );
    }

    // Перевірка типу файлу
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Можна завантажувати тільки зображення" },
        { status: 400 }
      );
    }

    // Перевірка розміру — максимум 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Максимальний розмір фото — 10 MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary не повернув результат"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      data: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Помилка завантаження фотографії",
      },
      { status: 500 }
    );
  }
}