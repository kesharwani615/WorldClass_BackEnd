import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { registerProdSubCategory } from "../controllers/prod.sub.category.controller.js";

const sub_category_route = Router();

// Register new User
sub_category_route.post("/register", upload("prodSubCategory").array("subCategoryImage", 1), registerProdSubCategory);

export default sub_category_route;  
