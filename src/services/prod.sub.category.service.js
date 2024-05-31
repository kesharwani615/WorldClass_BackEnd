import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { Product } from "../models/product.model.js";
import {
  deleteImage,
  validateObjectId,
  convertToObjectId,
} from "../helpers/helper.methods.js";
import { apiError } from "../utils/apiError.js";

//Register a new Product Sub Category
const registerProdSubCategory = async (body, prodSubCategoryImagePath) => {
  try {
    if (!prodSubCategoryImagePath || !prodSubCategoryImagePath.length) {
      throw new apiError(400, "Product sub category image is required");
    }

    const { categoryId, subCategoryName, subCategoryDescription } = body;
    if ([categoryId, subCategoryName].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const prodSubCategoryExists = await ProductSubCategory.findOne({
      subCategoryName,
    });

    if (prodSubCategoryExists) {
      throw new apiError(409, "Product sub category name is already exists.");
    }

    const prodSubCategory = await ProductSubCategory.create({
      categoryId,
      subCategoryName,
      subCategoryDescription,
      subCategoryImage: prodSubCategoryImagePath,
    });

    const prodSubCategoryResponse = await ProductSubCategory.findById({
      _id: prodSubCategory._id,
    }).populate({ path: "categoryId" });

    return prodSubCategoryResponse;
  } catch (error) {
    if (prodSubCategoryImagePath) {
      deleteImage(prodSubCategoryImagePath);
    }
    throw error;
  }
};

//Update Product Category
const updateProductSubCategory = async (body, prodSubCategoryId, prodSubCategoryImagePath) => {
  try {
    const prodSubCategoryIdObject = convertToObjectId(prodSubCategoryId);
    if (!prodSubCategoryIdObject) {
      throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
    }

    const { subCategoryName, subCategoryDescription } = body;

    if ([subCategoryName, subCategoryDescription].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const findProdSubCategory = await ProductSubCategory.findOne({_id: prodSubCategoryIdObject });
    if (!findProdSubCategory) {
      throw new apiError(404, "Product Sub Category Not Found");
    }

    if (prodSubCategoryImagePath) {
      deleteImage(findProdSubCategory.subCategoryImage);
      findProdSubCategory.subCategoryImage = prodSubCategoryImagePath;
    }

    Object.assign(findProdSubCategory, body);

    const updatedSubProdCategory = await findProdSubCategory.save();

    const populateSubCategory = await ProductSubCategory.findById({ _id: updatedSubProdCategory._id }).populate({ path: "categoryId" });
    return populateSubCategory;
  } catch (error) {
    if (prodSubCategoryImagePath) {
      deleteImage(prodSubCategoryImagePath);
    }
    throw error;
  }
};

//Delete product sub category
const deleteProductSubCategory = async (productSubCategoryId) => {
  const productSubCategoryIdObject = convertToObjectId(productSubCategoryId);
  if (!productSubCategoryIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const findSubCategoryInProduct = await Product.findOne({subCategoryId: productSubCategoryIdObject });
  if (findSubCategoryInProduct) {
    throw new apiError(409, "Sub Category is referenced by a Product, can not be deleted");
  }

  const prodSubCategoryToDelete = await ProductSubCategory.findOne({_id: productSubCategoryIdObject});
  if (!prodSubCategoryToDelete) {
    throw new apiError(404, "Product Sub Category not found"); 
  }
     
  const imageToDelete = prodSubCategoryToDelete.subCategoryImage;

  const result = await ProductSubCategory.deleteOne({_id: productSubCategoryIdObject});

  if (result.deletedCount === 0) {
    throw new apiError(400, "Product Sub Category not found");
  } 
  
  if(imageToDelete) {
    deleteImage(imageToDelete);    
  }

  return prodSubCategoryToDelete;
};

// Get all Product Sub Categories
const getAllProductSubCategories = async () => {
  const productSubCategories = await ProductSubCategory.find({})
    .populate({ path: "categoryId" })
    .sort({ subCategoryName: 1 });
  if (!productSubCategories) {
    throw new Error(400, "Product Sub Category(ies) not found");
  }
  return productSubCategories;
};

// Get Product Sub Category by Id
const getProductSubCategory = async (prodSubCategoryId) => {
  validateObjectId(
    prodSubCategoryId,
    "Invalid or prodSubCategoryId is missing"
  );

  const prodSubCategory = await ProductSubCategory.findOne({
    _id: prodSubCategoryId,
  }).populate({ path: "categoryId" });
  if (!prodSubCategory) {
    throw new apiError(400, "Product sub category not found");
  } else {
    return prodSubCategory;
  }
};

//Get Product Sub Category Count
const getProductSubCategoryCount = async () => {
  const prodSubCategory = await ProductSubCategory.countDocuments();
  if (!prodSubCategory) {
    throw new apiError(404, "No Product Sub Category(ies) found");
  }

  return prodSubCategory;
};

export default {
  registerProdSubCategory,
  updateProductSubCategory,
  deleteProductSubCategory,
  getAllProductSubCategories,
  getProductSubCategory,
  getProductSubCategoryCount,
};
