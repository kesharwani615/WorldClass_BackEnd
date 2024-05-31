import { Router } from "express";
import {
  deleteRole,
  getAllActiveRoles,
  getAllRoles,
  getRole,
  getRoleCount,
  registerRole,
  updateRole,
} from "../controllers/role.controller.js";

const roleRouter  = Router();

// Register new Role
roleRouter .post("/register", registerRole);
//Update Role
roleRouter .patch("/update/:id", updateRole);
//Delete Role
roleRouter .delete("/delete/:id", deleteRole);
//Get Role
roleRouter .get("/get-role/:id", getRole);
//Get Active Roles
roleRouter .get("/get-active-roles", getAllActiveRoles);
//Get all Roles
roleRouter .get("/get-roles", getAllRoles);
//Get Role count
roleRouter.get("/role-count", getRoleCount);

export default roleRouter ;  
