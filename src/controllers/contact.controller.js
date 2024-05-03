import contactService from "../services/contact.service.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Contact
const registerContact = asyncHandler(async (req, res) => {
  //TODO: Register a new Contact
  try {
    const contactResponse = await contactService.registerContact(req.body);
    return res
      .status(200).json(
        new apiResponse(200, contactResponse, "Contact created successfully")
      );
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Delete role
const deleteContact = asyncHandler(async (req, res) => {
  //TODO: Delete a Contact
  try {
    const { params } = req;
    const contactResponse = await contactService.deleteContact(params.id);
    return res
      .status(200).json(
        new apiResponse(200, contactResponse, "Contact Deleted Successfully"),
      );
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }),
      );
  }
});

const getContact = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const roleResponse = await contactService.getContact(params.id);
    return res
      .status(200).json(
        new apiResponse(200, roleResponse, "Contact fetched successfully"));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

//Get all Contacts
const getAllContacts = asyncHandler(async (req, res) => {
  try {

    const contactsResponse = await contactService.getAllContacts(req.query);
    return res
    .status(200).json(
      new apiResponse(200, contactsResponse, "Contact(s) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});

//Get All Contacts
const getAllContactsCount = asyncHandler(async (req, res) => {
  //TODO: Get all Contacts from the DB
  try {
    const response = await contactService.getAllContactsCount();
    return res
      .status(200)
      .json(new apiResponse(200, response, "All contacts fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

export {
  registerContact,
  deleteContact,
  getContact,
  getAllContacts,
  getAllContactsCount
};
