import { isValidObjectId } from "mongoose";
import { validateEmail } from "../helpers/helper.methods.js";
import { Contact } from "../models/contact.model.js";
import { apiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/send.email.js";

// Register new contact
const registerContact = async (contactDetails) => {
    const { conName, conEmail, conPhoneNumber, conCompanyName, conSubject, conMessage } = contactDetails;

    if ([conName, conEmail, conPhoneNumber, conCompanyName, conSubject].some((field) => field?.trim() === ""))
    {
        throw new apiError(400, "All fields are required"); 
    }

    //If email address is not valid, throw error
    if (!validateEmail(conEmail)) {
      throw new apiError(400, "Provide valid email address");
    }
  
    const newContact = new Contact(contactDetails);
    
    const savedContact = await newContact.save();
    if (!savedContact) {
      throw new apiError(400, "Something Went Wrong at the time of data saving");
    }
  
    // Constructing the email message for Admin
    const adminMessage = `
      Hello,

      <p>You have received a new inquiry from your website: </p>

      <b>Name:</b> ${conName}<br>
      <b>Email:</b> ${conEmail}<br>
      <b>Phone Number:</b> ${conPhoneNumber}<br>
      <b>Company Name:</b> ${conCompanyName}<br>
      <b>Subject:</b> ${conSubject}<br>
      <b>Message:</b> ${conMessage? conMessage: ''}<br><br>

      <p>Regards,</p>
      WorldClass GourmetFoods Pvt. Ltd.
      `;

      //Send email to the Admin
      await sendEmail(conEmail, conSubject, adminMessage);
    
      // Constructing the email message for User
      const userSubject = "Thank you for contacting us!";
      const userMessage = `Dear ${conName},
      
        <p>Thank you for reaching out to us through our contact form. We have received your message and will get back to you as soon as possible.</p>
        <p>Here are the details you provided:</p>

        <b>Name:</b> ${conName}<br>
        <b>Email:</b> ${conEmail}<br>
        <b>Phone Number:</b> ${conPhoneNumber}<br>
        <b>Company Name:</b> ${conCompanyName}<br>
        <b>Subject:</b> ${conSubject}<br>
        <b>Message:</b> ${conMessage? conMessage: ''}<br><br>
        
        <p>We appreciate your interest in our [company/product/service]. Rest assured, your inquiry is important to us, and we will do our best to address it promptly.</p>

        <p>If you have any further questions or concerns, feel free to reply to below contact details</p>
        
        <p>Best regards,</p>

        Worldclass Gourmetfoods Pvt. Ltd.<br>
        C20, 1st Floor, Industrial Area, Phase 1, Okhla,<br>
        New Delhi - 110020, Delhi, India <br>
        Phone: +91 11 40685109, +91 9971934258,<br> 
               +91 9971935301, +91 9871592231<br>
        Email: info@worldclassfoods.in<br>`

        //Send email to the User
        await sendEmail(conEmail, userSubject, userMessage);    
   
    return savedContact;
  };

// Delete contact
const deleteContact = async (contactId) => {
  //If contactId not validate, throw error
  if (!isValidObjectId(contactId)) {
    throw new apiError(400, "Invalid contactId");
  }
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  //If contactId not found and delete, throw error
  if (!deletedContact) {
    throw new apiError(404, "Either contact not found or deleted");
  }
  return deletedContact;
};

// Get Role
const getContact = async (contactId) => {
  //TODO: Get Contact
  if (!isValidObjectId(contactId) || !contactId?.trim()) {
    throw new apiError(400, "Either invalid or contactId is missing"); 
  }

  const contact = await Contact.findOne({ _id: contactId });
  if (!contact) {
    throw new apiError(400, "Contact not found"); 
  }else{
    return contact
  }
};

// Get all Contacts
const getAllContacts = async (query) => {
  //TODO: Get all Contacts
  let condition = {};

  if ("search" in query)
    condition['$or'] = [
      {conName:{ $regex: query.search, $options: "i" }},
      {conEmail:{ $regex: query.search, $options: "i" }}
    ];

const contacts = await Contact.find(condition).sort({ contactName: 1 });
  if (!contacts) {
    throw new Error(400, "Contact(s) not found");
  }
  return contacts;
};

//Get All User's Count
const getAllContactsCount = async () => {
  //TODO: Get All Users Count
  const totalContacts = await Contact.countDocuments();
  console.log("Contact Count: ", totalContacts);
  if (!totalContacts) {
    throw new apiError(404, "No contact(s) found");
  }

  return totalContacts;
};

// let condition = {};

//   if ("search" in req.query)
//     condition.blogDescription = { $regex: req.query.search, $options: "i" };
//   const blogs = await Blog.find(condition);


export default {
  registerContact,
  deleteContact,
  getContact,
  getAllContacts,
  getAllContactsCount
};