import { isValidObjectId } from "mongoose";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
//import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

//Register Sub Product Category

const registerProdSubCategory = async (body, prodSubCategoryImagePath) => {
  //TODO: Register a new Product Sub Category

  if (!prodSubCategoryImagePath.length) {
    throw new apiError(400, "Product sub category image is required");
  }

  //destructure the body
  const { categoryId, subCategoryName, subCategoryDescription } = body;
  if (
    [categoryId, subCategoryName].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const prodSubCategoryExists = await ProductSubCategory.findOne({ subCategoryName });

  if (prodSubCategoryExists) {
    throw new apiError(409, "Product sub category name is already exists.");
  }

  const prodSubCategory = await ProductSubCategory.create({
    categoryId,
    subCategoryName,
    subCategoryDescription,
    subCategoryImage: prodSubCategoryImagePath,
  });

  if (!prodSubCategory) {
    fs.unlink(prodSubCategoryImagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
    });
    throw new apiError(500, "Something went wrong while registering the product sub category");
  }

  return prodSubCategory;
};

export default {
  registerProdSubCategory,
};
