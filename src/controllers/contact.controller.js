import contactService from "../services/contact.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register a new Contact
const registerContact = asyncHandler(async (req, res) => {
  try {
    const response = await contactService.registerContact(req.body);
    return handleResponse(res, 201, response, "Contact registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete a contact
const deleteContact = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await contactService.deleteContact(params.id);
    return handleResponse(res, 200, response, "Contact deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get contact by Id
const getContact = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await contactService.getContact(params.id);
    return handleResponse(res, 200, response, "Contact fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get all Contacts
const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const response = await contactService.getAllContacts(req.query);
    return handleResponse(res, 200, response, "Contact(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Contacts
const getAllContactsCount = asyncHandler(async (req, res) => {
  try {
    const response = await contactService.getAllContactsCount();
    return handleResponse(res, 200, response, "All contact(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export {
  registerContact,
  deleteContact,
  getContact,
  getAllContacts,
  getAllContactsCount
};
