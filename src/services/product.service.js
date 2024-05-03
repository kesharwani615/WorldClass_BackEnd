import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
//import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import fs from "fs";

//Register Product

const registerProduct = async (body, productImagePath) => {
  //TODO: Register a new Product

  if (!productImagePath.length) {
    throw new apiError(400, "Product image is required");
  }

  //destructure the body
  const { subCategoryId, productName, productDescription, storage, packSize, cartonSize } = body;
  if ([subCategoryId, productName, productDescription].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const productExists = await Product.findOne({ productName });

  if (productExists) {
    throw new apiError(409, "Product name is already exists.");
  }

  const product = await Product.create({
    subCategoryId,
    productName,
    productDescription,
    productImage: productImagePath,
    storage,
    packSize,
    cartonSize
  });

  if (!product) {
    fs.unlink(productImagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
    });
    throw new apiError(500, "Something went wrong while registering the product");
  }

  return product;
};

export default {
    registerProduct,
};
