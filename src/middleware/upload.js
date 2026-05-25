import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "webp", "jpeg"],
    transformation: [
      {
        quality: "auto",     // 🔥 qualité automatique intelligente
        fetch_format: "auto" // 🔥 convertit en webp/avif si possible
      }
    ],
  },
});

const upload = multer({ storage });

export default upload;