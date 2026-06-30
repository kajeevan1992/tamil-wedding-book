const EmailTemplates = require('swig-email-templates');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const sendEmail = async (data, template, attachments = []) => {
    try {
        const env = process.env;
        var transport = nodemailer.createTransport({
            host: env.MAIL_HOST,
            port: env.MAIL_PORT,
            auth: {
                user: env.MAIL_USERNAME,
                pass: env.MAIL_PASSWORD
            }
        });

        var templates = new EmailTemplates();

        data.clientUrl = env.CLIENT_URL;
        data.copyRightDate = new Date().getFullYear();

        const { html, text, subject } = await templates.render(path.join(__dirname, '../emails/') + template, data);

        var mailOptions = {
            from: env.MAIL_FROM_ADDRESS,
            to: data.toEmail,
            subject: data.subject,

            html: html,
            attachments: attachments,
            cc: data.cc ? data.cc : []
            //? Attachments example
            // [ 
            //     {   
            //         filename: 'text.txt',
            //         content: 'Attachments'
            //     },
            //     {
            //         filename: 'logo',
            //         path: 'newlogo.png'
            //     }
            // ]
        };

        const info = await transport.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = sendEmail;