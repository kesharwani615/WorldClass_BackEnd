import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";

import fs from 'fs';
import path from 'path';
import { deleteImage } from "../helpers/helper.methods.js";

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, ' ')

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

//Update Product Category
const updateProduct = async (body, productId, productImagePath) => {

  // If productId is not validate, throw error 
  if(!isValidObjectId(productId)) {
    throw new apiError(400, "Invalid product ID");
  }
  
  //destructure the body
  const { productName, productDescription, storage, packSize, cartonSize } = body;

  if (
    [productName, productDescription].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Find the product by ID
  const product = await Product.findOne({_id: productId, isActive: true});

  //If product not found, throw error
  if(!product) {
    throw new apiError(404, "Product Not Found");
  }
  
  //Remove existing product image if it exists
  if (productImagePath) {
    deleteImage(path.join(currentDir, '..','..', product.productImage));
    product.productImage = productImagePath;
  }

  // Update other product details
  product.set(body);

  // Save the changes to the Product document
  const updateProduct = await product.save();

  console.log("Updated Product ====", updateProduct);

  return updateProduct;
}

//Delete Product
const deleteProduct = async (productId) => {
  //TODO: Delete Product

  //If productId not validate, throw error
  if (!isValidObjectId(productId)) {
    throw new apiError(400, "Invalid productId"); 
  }

  const deletedProduct = await Product.findByIdAndDelete(productId );

  if (!deletedProduct) {
    throw new apiError(400, "Either Product could not be found or already deleted"); 
  }

  return deletedProduct;
};


export default {
    registerProduct,
    updateProduct,
    deleteProduct,
};
