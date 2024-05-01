import roleService from "../services/role.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Role
const registerRole = async (req, res) => {
  //TODO: Register a new User
  try {
    // Extract role details like roleName
    const roleDetails = req.body;
    const registerRoleResponse = await roleService.registerRole(roleDetails);

    return res.status(201).json(
      new apiResponse(201, registerRoleResponse, "Role registered successfully"));

  } catch (error) {
    return res.status(500).json(new apiError({ statusCode: error.statusCode, message: error.message }));
  }
};

//Update Role
const updateRole = async (req, res) => {
  //TODO: Update a existing Role
  try {
    const { body, params } = req;
    const updateRoleResponse = await roleService.updateRole(
      params.id, body
    );

    return res.status(202).json(
      new apiResponse(200, updateRoleResponse, "Role updated successfully", true));
  } catch (error) {
    // Send error response if any error occurs
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
};

//Delete role
const deleteRole = async (req, res) => {
  //TODO: Delete Role from DB, if its reference is not in other documents(tables)
  try {
    const { params } = req;
    const deleteRoleResponse = await roleService.deleteRole( params.id );
    return res
      .status(200)
      .json(new apiResponse(200, deleteRoleResponse, "Role deleted successfully"));
    
  } catch (error) {
    return res
    .status(500)
    .json(new apiError({ statusCode: error.statusCode, message: error.message })
    );

  }
};

const getRole = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const roleResponse = await roleService.getRole(params.id);
    return res
      .status(200).json(
        new apiResponse(200, roleResponse, "Role fetched successfully"));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

const getAllActiveRoles = asyncHandler(async (req, res) => {
  try {
    const activeRolesResponse = await roleService.getAllActiveRoles();
    return res
    .status(200).json(
      new apiResponse(200, activeRolesResponse, "Role(s) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});

const getAllRoles = asyncHandler(async (req, res) => {
  try {
    const rolesResponse = await roleService.getAllRoles();
    return res
    .status(200).json(
      new apiResponse(200, rolesResponse, "Role(s) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});



export {
  registerRole,
  updateRole,
  deleteRole,
  getRole,
  getAllActiveRoles,
  getAllRoles,
};