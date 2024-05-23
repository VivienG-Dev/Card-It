const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: `${process.env.MAILJET_API_KEY}`,
    pass: `${process.env.MAILJET_SECRET_KEY}`,
  },
});

const sendVerificationEmail = (to, link) => {
  const mailOptions = {
    from: "webmaster@vivieng.com",
    to: to,
    subject: "Verify Your Email",
    html: `<p>Click this link to verify your email: <a href="${link}">Verify</a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendPasswordResetEmail = (to, link) => {
  const mailOptions = {
    from: "webmaster@vivieng.com",
    to: to,
    subject: "Reset Your Password",
    html: `<p>Click this link to reset your password: <a href="${link}">Reset</a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
