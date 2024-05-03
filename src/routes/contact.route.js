import { Router } from "express";
import {
  deleteContact,
  getAllContacts,
  getAllContactsCount,
  getContact,
  registerContact,
} from "../controllers/contact.controller.js";

const contact_route = Router();

// Register a new contact
contact_route.post("/register", registerContact);
// Delete contact
contact_route.delete("/delete/:id", deleteContact);
//Get contact by Id
contact_route.get("/get-contact/:id", getContact);
//Get all contact
contact_route.get("/get-all-contacts", getAllContacts);
//Get contacts count
contact_route.get("/total-contacts", getAllContactsCount);

export default contact_route;  