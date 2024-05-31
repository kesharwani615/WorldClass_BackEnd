import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { validateRoleDetails, validateObjectId, convertToObjectId} from "../helpers/helper.methods.js";

//Register a new Role
const registerRole = async (roleDetail) => {
  const { roleName } = roleDetail;
  if (!roleName || roleName?.trim() === "")
  {
    throw new apiError(400, "Role name is required"); 
  }

  const existingRole = await Role.findOne({ roleName });
  if (existingRole) {
    throw new apiError(409, "Role name already exists"); 
  }

  const newRole = await Role.create({ roleName });
  
  return newRole;
};

//Update Role - Role name, ensure roleDetails is provided and is an object
const updateRole = async (roleId, body) => {
  const roleIdObject = convertToObjectId(roleId);
  if (!roleIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const { roleName } = body;
  if (!roleName || roleName?.trim() === ""){
    throw new apiError(400, "Role name is required");
  }

  const findRole = await Role.findOne({ _id: roleIdObject });  
  if(!findRole) {      
    throw new apiError(404, "Role name Not Found");
  }

  Object.assign(findRole, body);
  const updatedRole = await findRole.save();
  return updatedRole;
};

//Delete role
const deleteRole = async (roleId) => {
 const roleIdObject = convertToObjectId(roleId);
 if (!roleIdObject) {
   throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
 }

  const userWithRole = await User.findOne({ _id: roleIdObject });
  if (userWithRole) {
    throw new apiError(400, "Role is referenced by a user, cannot be deleted"); 
  }

  const roleToDelete = await Role.findOne({_id: roleIdObject});
  if (!roleToDelete) {
    throw new apiError(404, "Role not found"); 
  }

  const result = await Role.deleteOne({_id: roleIdObject} );
  if (!result.deletedCount === 0) {
    throw new apiError(404, "Role not found"); 
  } 

  return roleToDelete;
};

// Get Role
const getRole = async (roleId) => {
  validateObjectId(roleId, "Invalid or missing roleId");

  const role = await Role.findById(roleId);
  if (!role) {
    throw new apiError(400, "Role not found"); 
  }

  return role
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

//Get Role Count
const getRoleCount = async () => {
  const role = await Role.countDocuments();
  if (!role) {
    throw new apiError(404, "No Role(s) found");
  }

  return role;
};

export default {
  registerRole,
  updateRole,
  deleteRole,
  getRole,
  getAllActiveRoles,
  getAllRoles,
  getRoleCount,
};
