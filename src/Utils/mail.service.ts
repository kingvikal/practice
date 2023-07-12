import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  debug: true,
});

export const sendMail = async (email: any, token: any, host: any) => {
  try {
    const mailOptions = {
      from: "vikalkh@gmail.com",
      to: email,
      subject: "reset password",
      html: `<h1>Click the link to reset Password </h1>
           http://${host}/resetPassword/${token}`,
    };

    const mail = await transporter.sendMail(mailOptions);

    if (mail) {
      return mail;
    }
  } catch (err) {
    return err;
  }
};
