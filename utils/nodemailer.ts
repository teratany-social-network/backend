import nodemailer from 'nodemailer'
import { ErrorHandler } from './error'
const sendMail = async (to: any, subject: any, text: any) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER || "",
            pass: process.env.MAIL_PASS || ""
        }
    })
    const mailOptions = {
        from: "teratany.org@gmail.com", // Sender address
        to, // List of recipients
        subject, // Subject line
        text // text plain
    }
    await transport.sendMail(mailOptions)
        .then(() => { return true })
        .catch((error: Error) => { throw new ErrorHandler(`Impossible d'envoyer le mail ${subject} vers ${to}`, error) })
}
export { sendMail }