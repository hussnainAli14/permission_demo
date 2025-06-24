const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // Create Transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //dEFINING THE EMIAL OPTION
  const mailOptions = {
    from: 'SardarBilal <rockeykhan142@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
