import dotEnv from "dotenv";
import nodemailer from "nodemailer";
dotEnv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'mailto:crm201426@gmail.com',
    pass: 'zzqpuncetujlrlqn',
  },
});

const sendEmail = async () => {
  try {
    // send mail with defined transport object
    let emailInfo = {
      from: '"Svaak Software" mailto:crm201426@gmail.com', // sender address
      // from:emailBody.email,
      to: "asif@yopmail.com", // list of receivers
      subject: "test", // Subject line
      html: `<p>test </p>`
    };
   let mail = await transporter.sendMail(emailInfo);
    console.log("send",mail);
    return true;
  }
  catch (error) {
    return error;
  }
}

export {sendEmail};
