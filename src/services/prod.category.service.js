import { ProductCategory } from "../models/product.category.model.js";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { deleteImage, validateObjectId } from "../helpers/helper.methods.js";
import { apiError } from "../utils/apiError.js";
import fs from 'fs';
import path from 'path';

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, ' ')

//Register a new Product Category
const registerProdCategory = async (body, prodCategoryImagePath) => {
  if (!prodCategoryImagePath || !prodCategoryImagePath.length) {
    throw new apiError(400, "Product category image is required");
  }

  const { categoryName, categoryDescription } = body;
  if ([categoryName, categoryDescription].some((field) => field?.trim() === "")) {
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
    deleteImage(prodCategoryImagePath)
    throw new apiError(500, "Something went wrong while registering the product category");
  }

  return prodCategory;
};

//Update Product Category
const updateProdCategory = async (body, prodCategoryId, prodCategoryImagePath) => {

  validateObjectId(prodCategoryId, "Invalid product category ID")
 
  const { categoryName, categoryDescription } = body;
  if ([categoryName, categoryDescription].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const prodCategory = await ProductCategory.findById(prodCategoryId);
  if(!prodCategory) {
    if(prodCategoryImagePath){
      deleteImage(prodCategoryImagePath);
    }
    throw new apiError(404, "Product Category Not Found");
  }
  
  if (prodCategoryImagePath) {    
    prodCategory.categoryImage = prodCategoryImagePath;
  }

  prodCategory.set(body);
  const updateProdCategory = await prodCategory.save();

  return updateProdCategory;
}

// Get all Product Categories
const getAllProdCategories = async () => {
  const prodCategories = await ProductCategory.find({}).sort({ categoryName: 1 });
  if (!prodCategories) {
    throw new Error(400, "Product Category(ies) not found");
  }
  return prodCategories;
};

//Delete product category
const deleteProdCategory = async (prodCategoryId) => {
  validateObjectId(prodCategoryId, "Invalid product category Id")

  const findProdCategoryInSubCategory = await ProductSubCategory.findById(prodCategoryId);
  console.log("---------- ", findProdCategoryInSubCategory);
  if (findProdCategoryInSubCategory) {
    throw new apiError(400, "Product Category is referenced by a sub category and can not be deleted"); 
  }
  
  const deletedProdCategory = await ProductCategory.findByIdAndDelete(prodCategoryId );
  if (!deletedProdCategory) {
    throw new apiError(400, "Either Product Category could not be found or deleted"); 
  }
   //Remove existing product Category image if it exists
    deleteImage(path.join(currentDir, '..','..', deletedProdCategory.categoryImage))
    return deletedProdCategory;
};

// Get Product Category
const getProdCategory = async (prodCategoryId) => {
  validateObjectId(prodCategoryId, "Invalid or prodCategoryId is missing")
  const prodCategory = await ProductCategory.findById(prodCategoryId);
  if (!prodCategory) {
    throw new apiError(400, "Product category not found"); 
  }
  return prodCategory
};

const getCategoryWithSubCategoryAndProducts = async () => {

  try {
    const products = await ProductCategory.aggregate(
      [
      {
        '$lookup': {
          'from': 'productsubcategories', 
          'localField': '_id', 
          'foreignField': 'categoryId', 
          'as': 'subcategory'
        }
      }, {
        '$lookup': {
          'from': 'products', 
          'localField': 'subcategory._id', 
          'foreignField': 'subCategoryId', 
          'as': 'products'
        }
      }
    ]
  );

    console.log('-------',products);
    return products;
    
  } catch (error) {
    
  }
};

export default {
  registerProdCategory,
  updateProdCategory,
  getAllProdCategories,
  deleteProdCategory,
  getProdCategory,
  getCategoryWithSubCategoryAndProducts
};
