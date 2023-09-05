import { Request, Response } from "express";
import mime from "mime-types";

export const verifyImage = async (req: Request, res: Response, next: any) => {
  const file = req.file;
  if (!file) return res.status(400).json({ msg: "Harap upload gambar" });

  // Mendapatkan tipe MIME dari nama file
  const detectedMimeType = mime.lookup(file.originalname);

  // Tipe MIME yang diizinkan (misalnya, "image/jpeg", "image/png", dll.)
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]; // Sesuaikan dengan jenis gambar yang diizinkan

  if (!detectedMimeType || !allowedMimeTypes.includes(detectedMimeType)) {
    return res.status(400).json({ msg: "File yang diunggah bukan gambar yang diizinkan." });
  }

  // File adalah gambar yang diizinkan, lanjutkan dengan pengunggahan ke direktori /upload
  next();
};
