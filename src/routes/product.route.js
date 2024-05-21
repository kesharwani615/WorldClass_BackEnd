import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { deleteProduct, getAllProducts, getProductById, registerProduct, updateProduct } from "../controllers/product.controller.js";
const productRouter = Router();

// Register Product
productRouter.post("/register", upload("product").array("productImage", 1), registerProduct);

// Update Product Category
productRouter.patch("/update/:id", upload('product').array("productImage", 1),  updateProduct);

// Delete Product
productRouter.delete("/delete/:id", deleteProduct);

//Get Active Product
productRouter.get("/get-all-products", getAllProducts);

//Get Product By Id
productRouter.get("/get-product/:id", getProductById);

export default productRouter;