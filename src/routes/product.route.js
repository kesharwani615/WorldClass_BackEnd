import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { registerProduct } from "../controllers/product.controller.js";
const product_route = Router();

// Register new User
product_route.post("/register", upload("product").array("productImage", 1), registerProduct);

export default product_route;  
