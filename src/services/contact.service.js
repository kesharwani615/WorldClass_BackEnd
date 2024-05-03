import { isValidObjectId } from "mongoose";
import { validateEmail } from "../helpers/helper.methods.js";
import { Contact } from "../models/contact.model.js";
import { apiError } from "../utils/apiError.js";
//import { sendEmail } from "../utils/send.email.js";

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
  
    const newContact = await new Contact(contactDetails);
    
    const savedContact = await newContact.save();
    if (!savedContact) {
      throw new apiError(400, "Something Went Wrong at the time of data saving");
    }
  
    // Constructing the email message
    // const emailMessage = `
    // Hello,

    // You have received a new inquiry from your website:

    // Name: ${conName}
    // Email: ${conEmail}
    // Phone Number: ${conPhoneNumber}
    // Company Name: ${conCompanyName}
    // Subject: ${conSubject}
    // Message: ${conMessage}

    // Regards,
    // Your Website
    // `;

    // // Sending the email
    // const transporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //     user: 'your_email@gmail.com',
    //     pass: 'your_password'
    // }
    // });

    // const mailOptions = {
    // from: 'your_email@gmail.com',
    // to: 'recipient_email@example.com',
    // subject: 'New Website Inquiry',
    // text: emailMessage
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    // if (error) {
    // console.error('Error occurred while sending email:', error);
    // } else {
    // console.log('Email sent:', info.response);
    // }
    // });

    // const subject = "you have raised your query";
    // const mesgForUser = `<p>Thank you for ${firstName} ${lastName} contacting dagna de.</p>
    //                         <p> we will work on that and get back to you soon!</p>`;
  
    // // Send the email for new contact user
    // await sendEmail(email, subject, mesgForUser);
  
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