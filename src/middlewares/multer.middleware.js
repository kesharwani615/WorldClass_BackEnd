import { apiError } from "../utils/apiError.js";
import fs from "fs";
import multer from "multer";
import path from "path";

// Define your file size limit in bytes
const FILE_SIZE_LIMIT = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

export const upload = (folderName) => {
  try {
    if (!fs.existsSync(`./public/${folderName}`)) {
      fs.mkdirSync(`./public/${folderName}`);
    }
    return multer({
      limits: {fileSize: FILE_SIZE_LIMIT},
      storage: multer.diskStorage({
        destination: async (req, file, cb) => {
          cb(null, `./public/${folderName}`);
        },

        filename: async (req, file, cb) => {
          const extension = path.extname(file.originalname);
          const fileNameWithoutExtension = path.basename(file.originalname, extension);

          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const hours = String(currentDate.getHours()).padStart(2, '0');
          const minutes = String(currentDate.getMinutes()).padStart(2, '0');
          const seconds = String(currentDate.getSeconds()).padStart(2, '0');

          const timestamp = `${day}${month}${year}_${hours}${minutes}${seconds}`;

          const fileName = `${fileNameWithoutExtension}_${timestamp}${extension}`;
          cb(null, fileName);
        },
      }),
    });
  } catch (error) {
    throw new apiError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
};
