import fs from 'fs';

// Password validation Method
const validatePassword = (password) => {
  // Define the regex pattern for password validation
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{6,}$/;

  // Test the password against the regex pattern
  return passwordRegex.test(password);
};

// Email validation Methods
const validateEmail = (email) => {
  // Regular expression for basic email validation
  const emailRegex = /^\S+@\S+\.\S{2,}$/;
  return emailRegex.test(email);
};

// Delete Image from given path
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`Removed existing product category image: ${imagePath}`);
    } catch (err) {
      console.error("Error occurred while deleting file:", err);
    }
    } else {
      console.log("File does not exist:", imagePath);
    }
  return;
};

export {  
  validatePassword, 
  validateEmail, 
  deleteImage };
