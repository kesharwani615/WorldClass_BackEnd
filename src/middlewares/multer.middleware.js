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
          const fileName = path.basename(
            file.originalname + Date.now(),
            extension
          );
          cb(null, `${fileName}${extension}`);
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
