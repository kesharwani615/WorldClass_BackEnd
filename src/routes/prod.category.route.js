import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { registerProdCategory } from "../controllers/prod.category.controller.js";

const category_route = Router();

// Register new Product Category
category_route.post("/register", upload("prodCategory").array({name: "categoryImage", maxCount:1}), registerProdCategory);

//Update Product Category
//category_route.patch("/update/:id", upload('prodCategory').array({ name: "categoryImage", maxCount: 1 }),  updateUserProfile);

export default category_route;  
