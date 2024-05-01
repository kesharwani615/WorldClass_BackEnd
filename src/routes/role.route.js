import { Router } from "express";
import {
  deleteRole,
  getAllActiveRoles,
  getAllRoles,
  getRole,
  registerRole,
  updateRole,
} from "../controllers/role.controller.js";

const role_route = Router();

// Register new Role
role_route.post("/register", registerRole);

//Update Role
role_route.patch("/update/:id", updateRole);

//Delete Role
role_route.delete("/delete/:id", deleteRole);

//Get Role
role_route.get("/get-role/:id", getRole);

//Get Active Roles
role_route.get("/get-active-roles", getAllActiveRoles);

//Get all Roles
role_route.get("/get-roles", getAllRoles);

export default role_route;  
