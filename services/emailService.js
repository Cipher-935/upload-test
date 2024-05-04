const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ recipient_email, OTP }) => 
{
    console.log('The configured email is:', process.env.EMAIL);

    console.log('Recipient email is: ', recipient_email);

    console.log('OTP is:', OTP);

    const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: 
        {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_2FA,
        },
    });

    const mailConfigs =
    {
        from: process.env.EMAIL,
        to: recipient_email,
        subject: "TubeTransfer email confirmation",
        html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                <meta charset="UTF-8">
                <title>CodePen - OTP Email Template</title>
                

                </head>
                <body>
                <!-- partial:index.partial.html -->
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 3 minutes</p>
                <h2 style="background: #392467;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                </div>
                <!-- partial -->
                
                </body>
                </html>`,
            };

    try 
    {
        const info = await transporter.sendMail(mailConfigs);
        return { message: "Email sent successfully" };
    } 
    catch (error) 
    {
        console.error(error);
        throw new Error('An error occurred while sending the email');
    }
    };

module.exports = { sendEmail };