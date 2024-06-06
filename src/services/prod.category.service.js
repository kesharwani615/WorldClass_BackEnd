import { ProductCategory } from "../models/product.category.model.js";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { deleteImage, validateObjectId, convertToObjectId } from "../helpers/helper.methods.js";
import { apiError } from "../utils/apiError.js";

//Register a new Product Category
const registerProdCategory = async (body, prodCategoryImagePath) => {
  try {
    if (!prodCategoryImagePath || !prodCategoryImagePath.length) {
      throw new apiError(400, "Product category image is required");
    }
  
    const { categoryName, categoryDescription } = body;

    if ([categoryName, categoryDescription].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }
  
    const findProdCategory = await ProductCategory.findOne({ categoryName });
    if (findProdCategory) {
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
  } catch (error) {
    if (prodCategoryImagePath) {
      deleteImage(prodCategoryImagePath);
    }

    throw error;
  }
};

//Update Product Category
const updateProdCategory = async (body, prodCategoryId, prodCategoryImagePath) => {
  try {
    const prodCategoryIdObject = convertToObjectId(prodCategoryId);
    if (!prodCategoryIdObject) {
      throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
    }

    const { categoryName, categoryDescription } = body;
  
    if ([categoryName, categoryDescription].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }
  
    const findProductCategory = await ProductCategory.findOne({_id: prodCategoryIdObject});
    if(!findProductCategory) {
      throw new apiError(404, "Product Category Not Found");
    }
    
    if (prodCategoryImagePath) {    
      deleteImage(findProductCategory.categoryImage);    
      findProductCategory.categoryImage = prodCategoryImagePath;
    }
  
    Object.assign(findProductCategory, body);
  
    const updatedProdCategory = await findProductCategory.save();
  
    return updatedProdCategory;
  } catch (error) {
    if (prodCategoryImagePath) {    
      deleteImage(prodCategoryImagePath);    
    }
    throw error;
  }
}

//Delete product category
const deleteProdCategory = async (prodCategoryId) => {
  const prodCategoryIdObject = convertToObjectId(prodCategoryId);
  if (!prodCategoryIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const findProdCategoryInSubCategory = await ProductSubCategory.findOne({categoryId: prodCategoryIdObject});
  if (findProdCategoryInSubCategory) {
    throw new apiError(409, "Category is referenced by a Sub Category, can not be deleted"); 
  }

  const prodCategoryToDelete = await ProductCategory.findOne({_id: prodCategoryIdObject});
  if (!prodCategoryToDelete) {
    throw new apiError(404, "Product Category not found"); 
  }
   
  const imageToDelete = prodCategoryToDelete.categoryImage;

  const result = await ProductCategory.deleteOne({ _id: prodCategoryIdObject });
  
  if (result.deletedCount === 0) {
      throw new apiError(404, "Product category not found"); 
  } 
  
  if(imageToDelete) {
    deleteImage(imageToDelete)
  }

  return prodCategoryToDelete
};

// Get all Product Categories
const getAllProdCategories = async () => {
  const prodCategories = await ProductCategory.find({});
  if (!prodCategories) {
    throw new Error(400, "Product Category(ies) not found");
  }
  return prodCategories;
};

// Get Product Category by Id
const getProdCategory = async (prodCategoryId) => {
  validateObjectId(prodCategoryId, "Invalid or prodCategoryId is missing")

  const prodCategory = await ProductCategory.findById(prodCategoryId);
  if (!prodCategory) {
    throw new apiError(400, "Product category not found"); 
  }
  return prodCategory
};

//Get Product Category Count
const getProdCategoryCount = async () => {
  const prodCategory = await ProductCategory.countDocuments();
  if (!prodCategory) {
    throw new apiError(404, "No Product Category(ies) found");
  }

  return prodCategory;
};

export default {
  registerProdCategory,
  updateProdCategory,
  getAllProdCategories,
  deleteProdCategory,
  getProdCategory,
  getProdCategoryCount
};
