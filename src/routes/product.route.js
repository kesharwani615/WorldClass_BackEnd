import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { deleteProduct, registerProduct, updateProduct } from "../controllers/product.controller.js";
const product_route = Router();

// Register Product
product_route.post("/register", upload("product").array("productImage", 1), registerProduct);

// Update Product Category
product_route.patch("/update/:id", upload('product').array("productImage", 1),  updateProduct);

// Delete Product
product_route.delete("/delete/:id", deleteProduct);

//Get Active Product
product_route.get("/get-product", getProducts);

export default product_route;