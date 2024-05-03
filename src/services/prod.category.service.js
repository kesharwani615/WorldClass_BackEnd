import { isValidObjectId } from "mongoose";
import { ProductCategory } from "../models/product.category.model.js";
//import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

//Register Product Category

const registerProdCategory = async (body, prodCategoryImagePath) => {
  //TODO: Register a new Product Category

  if (!prodCategoryImagePath || !prodCategoryImagePath.length) {
    throw new apiError(400, "Product category image is required");
  }

  //destructure the body
  const { categoryName, categoryDescription } = body;

  if (
    [categoryName, categoryDescription].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const prodCategoryExists = await ProductCategory.findOne({ categoryName });
 
  if (prodCategoryExists) {
    throw new apiError(409, "Product category name is already exists.");
  }
 
  const prodCategory = await ProductCategory.create({
    categoryName,
    categoryDescription,
    categoryImage: prodCategoryImagePath,
  });

  if (!prodCategory) {
    fs.unlink(prodCategoryImagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
    });
    throw new apiError(500, "Something went wrong while registering the product category");
  }

  return prodCategory;
};

export default {
  registerProdCategory,
};
