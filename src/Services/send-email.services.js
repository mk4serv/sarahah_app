
import nodemailer from 'nodemailer';
import { EventEmitter } from "node:events"
import { EmailTemplate } from '../Utils/email-template.utils.js';



// ✅ Send Email Service
export const SendEmailService = async (
    {
        to,
        subject,
        message,
        attachments = []
    }
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            //      tls: {
            //        rejectUnauthorized: false
            //  }
        })

        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USERNAME}>`,
            to,
            cc: 'khairyworks@gmail.com',
            subject,
            html: EmailTemplate({ message, subject }),
            attachments
        })
        return info
    } catch (error) {
        console.error('Send Email error:', error);
        return error
    }
}

// ✅ Event Emitter
export const emitter = new EventEmitter();

// ✅ Event Listener for sending emails
emitter.on('sendEmail', (...args) => {
    //   console.log('email sent', args);
    // Check if args[0] is an array
    if (Array.isArray(args[0])) {
        const [to, subject, message, attachments] = args[0];
        const { text, data, confirmEmailLink } = message;
        SendEmailService({
            to,
            subject,
            message: { text, data, confirmEmailLink },
            attachments
        });
    } else {
        console.error('Expected args[0] to be an array, but got:', args[0]);
    }
    // console.log('email sent');
})