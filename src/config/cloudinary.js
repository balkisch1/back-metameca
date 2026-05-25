import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // 👈 optionnel mais SAFE ici

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("ENV CHECK:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY?.slice(0, 5),
});

export default cloudinary;