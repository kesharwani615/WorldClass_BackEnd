import { isValidObjectId } from "mongoose";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";


//Register Role
const registerRole = async (roleDetail) => {
  //TODO: Register a new Role
  const { roleName } = roleDetail;

  //If role name not provided, throw error
  if (!roleName || roleName === "")
  {
    throw new apiError(400, "Role name is required"); 
  }

  // Check existing role
  const existingRole = await Role.findOne({roleName});

  //If role name not provided, throw error
  if (existingRole) {
    throw new apiError(400, "Role name already exists"); 
  }

  const newRole = await Role.create({ roleName  });
  
  if (!newRole) {
    throw new apiError(500, "Something went wrong, while registering the Role");
  }
  return newRole;
};

//Update role
const updateRole = async (roleId, roleDetail) => {
  // TODO: Update Role - Role name, 
  // Ensure roleDetails is provided and is an object

  if (!roleDetail || typeof roleDetail !== "object") {
    throw new apiError(400, "Invalid role details"); 
  }

  //If roleId not validate, throw error
  if (!isValidObjectId(roleId)) {
    throw new apiError(400, "Invalid roleId"); 
  }

  // Find the role by ID
  const role = await Role.findOne({_id: roleId, isActive: true});

  //If role not found in DB, throw error
  if (!role) {
    throw new apiError(404, "Role not found"); 
  }

  const updatedRole = await Role.updateOne(
    { _id: roleId },
    { $set: roleDetail},
    { new: true }
  );

  //If not updated, throw error
  if (!updatedRole || updatedRole.matchedCount === 0) {
    throw new apiError(404, "Role could not be updated"); 
  }
  return updatedRole;
};

//Delete role
const deleteRole = async (roleId) => {
  //TODO: Delete Role

  //If roleId not validate, throw error
  if (!isValidObjectId(roleId)) {
    throw new apiError(400, "Invalid roleId"); 
  }

  //If role exist in User table, should not be deleted
  const findRoleInUser = await User.find({ roleId });
  //If role found, throw error
  if (findRoleInUser.length) {
    throw new apiError(400, "Referential Integrity (User): Role can not be deleted"); 
  }

  const deletedRole = await Role.findByIdAndDelete(roleId );

  if (!deletedRole) {
    throw new apiError(400, "Either Role could not be found or  deleted"); 
  }

  return deletedRole;
};

// Get Role
const getRole = async (roleId) => {
  //TODO: Get Role
  if (!isValidObjectId(roleId)) {
    throw new apiError(400, "Invalid roleId"); 
  }

  if (!roleId?.trim()) {
    throw new apiError(400, "RoleId is missing"); 
  }

  const role = await Role.findOne({ _id: roleId });
  
  if (!role) {
    throw new apiError(400, "Role not found"); 
  }else{
    return role
  }
};

// Get all Active Roles
const getAllActiveRoles = async () => {
  //TODO: Get Active Roles
  const roles = await Role.find({isActive: true}).sort({ roleName: 1 });
  if (!roles) {
    throw new Error(400, "Role(s) not found");
  }
  return roles;
};

// Get all Active Roles
const getAllRoles = async () => {
  //TODO: Get Active Roles
  const roles = await Role.find({}).sort({ roleName: 1 });
  if (!roles) {
    throw new Error(400, "Role(s) not found");
  }
  return roles;
};

export default {
  registerRole,
  updateRole,
  deleteRole,
  getRole,
  getAllActiveRoles,
  getAllRoles,
};
