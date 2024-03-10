import express from "express";
import nodemailer from 'nodemailer';

export const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: '65011212154@msu.ac.th',
        pass: 'gvhb yccp satf oult'
    },
});

router.post('/', async (req, res)=>{
    try {
        const { recipient, subject, content } = req.body;
    
        const info = await transporter.sendMail({
          from: '"Facemash ProJDev." <65011212154@msu.ac.th>',
          to: recipient,
          subject,
          html: content,
        });
    
        console.log("Email sent:", info.response);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: 'Failed to send email' });
    }
});
