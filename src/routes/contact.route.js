import { Router } from "express";
import {
  deleteContact,
  getAllContacts,
  getAllContactsCount,
  getContact,
  registerContact,
} from "../controllers/contact.controller.js";

const contactRouter = Router();

// Register a new contact
contactRouter.post("/register", registerContact);
// Delete contact
contactRouter.delete("/delete/:id", deleteContact);
//Get contact by Id
contactRouter.get("/get-contact/:id", getContact);
//Get all contact
contactRouter.get("/get-all-contacts", getAllContacts);
//Get contacts count
contactRouter.get("/contact-count", getAllContactsCount);

export default contactRouter;  