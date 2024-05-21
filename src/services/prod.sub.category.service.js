import { isValidObjectId } from "mongoose";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
//import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import fs from 'fs';
import path from 'path';
import { deleteImage } from "../helpers/helper.methods.js";

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, ' ')

//Register a new Product Sub Category
const registerProdSubCategory = async (body, prodSubCategoryImagePath) => {
  if (!prodSubCategoryImagePath.length) {
    throw new apiError(400, "Product sub category image is required");
  }

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
    deleteImage(prodSubCategoryImagePath)
    fs.unlink(prodSubCategoryImagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
    });
    throw new apiError(500, "Something went wrong while registering the product sub category");
  }

  const prodSubCategoryResponse = await ProductSubCategory.findById({_id:prodSubCategory._id}).populate({path:"categoryId"})

  return prodSubCategoryResponse;
  
};

//Update Product Category
const updateProductSubCategory = async (body, prodSubCategoryId, prodSubCategoryImagePath) => {

  // Validate prodCategoryId
  if(!isValidObjectId(prodSubCategoryId)) {
    throw new apiError(400, "Invalid product sub category ID");
  }
  
  //destructure the body
  const { subCategoryName, subCategoryDescription } = body;

  if (
    [subCategoryName, subCategoryDescription].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Find the product sub category by ID
  const prodSubCategory = await ProductSubCategory.findOne({_id: prodSubCategoryId});

  //If prodSubCategory not found, throw error
  if(!prodSubCategory) {
    throw new apiError(404, "Product Sub Category Not Found");
  }
  
  //Remove existing product Sub Category image if it exists
  if (prodSubCategoryImagePath) {
    deleteImage(path.join(currentDir, '..','..', prodSubCategory.subCategoryImage));
  
    prodSubCategory.subCategoryImage = prodSubCategoryImagePath;
  }

  // Update other product sub category details
  prodSubCategory.set(body);

  // Save the changes to the sub product category document
  const updateSubProdCategory = await prodSubCategory.save();

  const updateSubCategoryResponse = await ProductSubCategory.findById({_id:updateSubProdCategory._id}).populate({path:"categoryId"})

  return updateSubCategoryResponse;
}

//Delete product sub category
const deleteProductSubCategory = async (productSubCategoryId) => {
  //TODO: Delete Product Sub Category

  //If product sub category not validate, throw error
  if (!isValidObjectId(productSubCategoryId)) {
    throw new apiError(400, "Invalid product sub category ID"); 
  }

  //If product sub category exist in Product table, should not be deleted
  //const findProductSubCategoryInProduct = await Product.find({ subCategoryId: productSubCategoryId});
  
  //If product category found, throw error
  // if (findProductSubCategoryInProduct.length) {
  //   throw new apiError(400, "Referential Integrity (Product): Product Category can not be deleted"); 
  // }
  
  const deletedProductSubCategory = await ProductSubCategory.findByIdAndDelete({_id: productSubCategoryId});

  if (!deletedProductSubCategory) {
    throw new apiError(400, "Either Product Sub Category could not be found or already deleted"); 
  }

   //Remove existing product Sub Category image if it exists
    deleteImage(path.join(currentDir, '..','..', deletedProductSubCategory.subCategoryImage));

  return deletedProductSubCategory;
};

// Get all Sub Product Categories
const getAllSubProdCategories = async () => {
  //TODO: Get All Sub Product Categories
  
  const productSubCategories = await ProductSubCategory.find({}).populate({path:"categoryId"}).sort({ subCategoryName: 1 });
  if (!productSubCategories) {
    throw new Error(400, "Product Sub Category(ies) not found");
  }
  return productSubCategories;
};

// Get Product Category
const getProductSubCategory = async (prodSubCategoryId) => {
  //TODO: Get Product Category
  if (!isValidObjectId(prodSubCategoryId) || !prodSubCategoryId?.trim()) {
    throw new apiError(400, "Invalid or prodSubCategoryId is missing"); 
  }

  const prodSubCategory = await ProductSubCategory.findOne({ _id: prodSubCategoryId }).populate({path:"categoryId"});
  if (!prodSubCategory) {
    throw new apiError(400, "Product sub category not found"); 
  }else{
    return prodSubCategory
  }
};

export default {
  registerProdSubCategory,
  updateProductSubCategory,
  deleteProductSubCategory,
  getAllSubProdCategories,
  getProductSubCategory,
};
