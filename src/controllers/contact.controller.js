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
    const response = await contactService.deleteContact(req.params.id);
    return handleResponse(res, 200, response, "Contact deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get contact by Id
const getContact = asyncHandler(async (req, res) => {
  try {
    const response = await contactService.getContact(req.params.id);
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

//Get Contacts Count
const getAllContactsCount = asyncHandler(async (req, res) => {
  try {
    const response = await contactService.getAllContactsCount();
    return handleResponse(res, 200, response, "Count of contact(s) fetched successfully");
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
