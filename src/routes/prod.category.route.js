import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { registerProdCategory } from "../controllers/prod.category.controller.js";

const category_route = Router();

// Register new User
category_route.post("/register", upload("prodCategory").array("categoryImage", 1), registerProdCategory);

export default category_route;  
