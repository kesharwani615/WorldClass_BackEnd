import { ProductCategory } from "../models/product.category.model.js";
import { ProductSubCategory } from "../models/product.sub.category.model.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";
import { deleteImage, validateObjectId , convertToObjectId} from "../helpers/helper.methods.js";

//Register Product
const registerProduct = async (body, productImagePath) => {
  try {
    if (!productImagePath || !productImagePath.length) {
      throw new apiError(400, "Product image is required");
    }
  
    const { subCategoryId, productName, productDescription, storage, packSize, cartonSize } = body;
    if ([subCategoryId, productName, productDescription].some((field) => field?.trim() === "")
    ) {
      throw new apiError(400, "All fields are required");
    }
  
    const findProduct = await Product.findOne({ productName });
  
    if (findProduct) {
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
  
    return product;
  } catch (error) {
    if (productImagePath) {
      deleteImage(productImagePath);
    }
    throw error;
  }
};

//Update Product Category
const updateProduct = async (body, productId, productImagePath) => {
try {
    const productIdObject = convertToObjectId(productId);
    if (!productIdObject) {
      throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
    }

    const { productName, productDescription } = body;
  
    if (
      [productName, productDescription].some((field) => field?.trim() === "")
    ) {
      throw new apiError(400, "All fields are required");
    }
  
    const findProduct = await Product.findOne({ _id: productIdObject });
    if(!findProduct) {      
      throw new apiError(404, "Product Not Found");
    }
    
    if (productImagePath) {
      deleteImage(findProduct.productImage);    
      findProduct.productImage = productImagePath;
    }
  
    Object.assign(findProduct, body)
    
    const updatedProduct = await findProduct.save();
  
    return updatedProduct;
} catch (error) {
  if(productImagePath){
    deleteImage(productImagePath);
  }
  throw error;
}
}

//Delete Product
const deleteProduct = async (productId) => {
  const productIdObject = convertToObjectId(productId);
  if (!productIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const productToDelete = await Product.findOne({_id: productIdObject});
  if (!productToDelete) {
    throw new apiError(404, "Product not found"); 
  }

  const imageToDelete = productToDelete.productImage;

  const result = await Product.deleteOne({_id: productIdObject});

  if (!result.deletedCount === 0) {
    throw new apiError(404, "Product not found"); 
  } 
    
  if(imageToDelete){
    deleteImage(imageToDelete);
  }

  return productToDelete;        
};

// Get all Products
const getProducts = async () => {  
  const products = await Product.find({}).populate({
    path: 'subCategoryId',
    populate: {
      path: 'categoryId'
    }
  });
  if (!products) {
    throw new Error(400, "Product(s) not found");
  }
  return products;
};

//Get product By Id
const getProductById = async (productId) => {  
  const product = await Product.findById(productId).populate({
    path: 'subCategoryId',
    populate: {
      path: 'categoryId'
    }
  });
  if (!product) {
    throw new Error(400, "Product(s) not found");
  }
  return product;
};

//Get Products by Sub Category
const getProductsBySubCategory = async (subCategoryId) => {
  if (!isValidObjectId(subCategoryId)) {
    throw new apiError(400, "Invalid subCategoryId"); 
  }
  
  const products = await Product.find({subCategoryId});
  if (!products) {
    throw new Error(400, "Product(s) not found");
  }
  return products;
};

//Get Products by Sub Category
const getProductsByCategoryAndSubCategory = async () => {    
  const products = await ProductCategory.aggregate([
    {
      '$lookup': {
        'from': 'productsubcategories', 
        'localField': '_id', 
        'foreignField': 'categoryId', 
        'as': 'subCategory'
      }
    },
    {
      '$unwind': {
        path: '$subCategory',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      '$lookup': {
        'from': 'products', 
        'localField': 'subCategory._id', 
        'foreignField': 'subCategoryId', 
        'as': 'products'
      }
    },
    {
      '$group': {
        _id: '$_id',
        categoryName: { $first: '$categoryName' }, 
        categoryDescription: {$first: '$categoryDescription'},
        categoryImage: {$first: '$categoryImage'},
        subCategory: { 
          $push: {
            _id: '$subCategory._id',
            subCategoryName: '$subCategory.subCategoryName', 
            subCategoryImage: '$subCategory.subCategoryImage', 
            products: '$products'
          }
        }        
      }
    }
  ]);

  return products;
};

//Get Product Count
const getProductCount = async () => {
  const product = await Product.countDocuments();
  if (!product) {
    throw new apiError(404, "No Product(s) found");
  }

  return product;
};

export default {
    registerProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    getProductsBySubCategory,
    getProductsByCategoryAndSubCategory,
    getProductCount,
};
