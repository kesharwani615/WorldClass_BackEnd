import { isValidObjectId } from "mongoose";
import { ProductCategory } from "../models/product.category.model.js";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { apiError } from "../utils/apiError.js";
import fs from 'fs';
import path from 'path';
import { deleteImage } from "../helpers/helper.methods.js";

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, ' ')

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

//Update Product Category
const updateProdCategory = async (body, prodCategoryId, prodCategoryImagePath) => {

  // Validate prodCategoryId
  if(!isValidObjectId(prodCategoryId)) {
    throw new apiError(400, "Invalid product category ID");
  }
  
  //destructure the body
  const { categoryName, categoryDescription } = body;

  if (
    [categoryName, categoryDescription].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Find the product category by ID
  const prodCategory = await ProductCategory.findOne({_id: prodCategoryId, isActive: true});

  console.log("Fetching existing prodCategory", prodCategory);

  //If prodCategory not found, throw error
  if(!prodCategory) {
    throw new apiError(404, "Product Category Not Found");
  }
  
  //Remove existing product Category image if it exists
  if (prodCategoryImagePath) {
  const imagePath = path.join(currentDir, '..','..', prodCategory.categoryImage);
  
  deleteImage(imagePath);
  // if (fs.existsSync(imagePath)) {
  //   try {
  //     fs.unlinkSync(imagePath);
  //     console.log(`Removed existing product category image: ${imagePath}`);
  //   } catch (err) {
  //     console.error("Error occurred while deleting file:", err);
  //   }
  //   } else {
  //     console.log("File does not exist:", imagePath);
  //   }
    prodCategory.categoryImage = prodCategoryImagePath;
  }

  // Update other product category details
  prodCategory.set(body);

  // Save the changes to the blog document
  const updateProdCategory = await prodCategory.save();

  console.log("Updated Product Category", updateProdCategory);

  return updateProdCategory;
}

// Get all Product Categories
const getAllProdCategories = async () => {
  //TODO: Get Product Categories
  
  const prodCategories = await ProductCategory.find({}).sort({ categoryName: 1 });
  if (!prodCategories) {
    throw new Error(400, "Product Category(ies) not found");
  }
  return prodCategories;
};

//Delete product category
const deleteProdCategory = async (prodCategoryId) => {
  //TODO: Delete Product Category

  //If product category not validate, throw error
  if (!isValidObjectId(prodCategoryId)) {
    throw new apiError(400, "Invalid product category ID"); 
  }

  //If product category exist in ProductSubCategory table, should not be deleted
  const findProdCategoryInSubCategory = await ProductSubCategory.find({ categoryId: prodCategoryId });
  
  //If product category found, throw error
  if (findProdCategoryInSubCategory.length) {
    throw new apiError(400, "Referential Integrity (ProductSubCategory): Product Category can not be deleted"); 
  }
  
  const deletedProdCategory = await ProductCategory.findByIdAndDelete(prodCategoryId );

  if (!deletedProdCategory) {
    throw new apiError(400, "Either Product Category could not be found or deleted"); 
  }

   //Remove existing product Category image if it exists
    const imagePath = path.join(currentDir, '..','..', deletedProdCategory.categoryImage);
  
    deleteImage(imagePath)
  // if (fs.existsSync(imagePath)) {
  //   try {
  //     fs.unlinkSync(imagePath);
  //     console.log(`Removed existing product category image: ${imagePath}`);
  //   } catch (err) {
  //     console.error("Error occurred while deleting file:", err);
  //   }
  //   } else {
  //     console.log("File does not exist:", imagePath);
  //   }

  return deletedProdCategory;
};

// Get Product Category
const getProdCategory = async (prodCategoryId) => {
  //TODO: Get Product Category
  if (!isValidObjectId(prodCategoryId) || !prodCategoryId?.trim()) {
    throw new apiError(400, "Invalid or prodCategoryId is missing"); 
  }

  const prodCategory = await ProductCategory.findOne({ _id: prodCategoryId });
  if (!prodCategory) {
    throw new apiError(400, "Product category not found"); 
  }else{
    return prodCategory
  }
};

export default {
  registerProdCategory,
  updateProdCategory,
  getAllProdCategories,
  deleteProdCategory,
  getProdCategory
};
