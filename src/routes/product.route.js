import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    deleteProduct, 
    getProductById, 
    getProductCount, 
    getProducts, 
    getProductsByCategoryAndSubCategory, 
    getProductsBySubCategory, 
    registerProduct, 
    updateProduct } from "../controllers/product.controller.js";

const productRouter = Router();

// Register Product
productRouter.post("/register", upload("product").array("productImage", 1), registerProduct);
// Update Product Category
productRouter.patch("/update/:id", upload('product').array("productImage", 1),  updateProduct);
// Delete Product
productRouter.delete("/delete/:id", deleteProduct);
//Get all Product
productRouter.get("/get-products", getProducts);
//Get Product By Id
productRouter.get("/get-product/:id", getProductById);
//Get Products by sub category id
productRouter.get("/get-products-by-sub-category/:id", getProductsBySubCategory);
//Get all Products by Category and Sub Category
productRouter.get("/get-products-by-category-and-sub-category", getProductsByCategoryAndSubCategory);
//Get Product count
productRouter.get("/product-count", getProductCount);
productRouter.get("/product-count", getProductCount);

export default productRouter;