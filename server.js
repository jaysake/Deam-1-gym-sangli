require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'j40000948@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD // The user will need to provide an app password
    }
});

// API Endpoint for Contact Form & Registrations
app.post('/api/contact', async (req, res) => {
    const { 
        formType = 'General Inquiry', 
        fullName, 
        warriorNickname, 
        phone, 
        goal, 
        timeSlot, 
        tenure = '3 Days', 
        membershipTier,
        notes 
    } = req.body;

    const subject = `[${formType.toUpperCase()}] Lead from DREAM 1 GYM: ${fullName || 'Anonymous'}`;

    const textContent = `You have received a new submission from DREAM 1 GYM.

Submission Type: ${formType}
----------------------------------------
- Full Name: ${fullName || 'N/A'}
${warriorNickname ? `- Warrior Nickname: ${warriorNickname}\n` : ''}- WhatsApp / Phone: ${phone || 'N/A'}
${goal ? `- Fitness Goal: ${goal}\n` : ''}${tenure ? `- Trial / Membership Tenure: ${tenure}\n` : ''}${membershipTier ? `- Membership Plan: ${membershipTier}\n` : ''}${timeSlot ? `- Preferred Time Slot: ${timeSlot}\n` : ''}${notes ? `- Notes / Message: ${notes}\n` : ''}
----------------------------------------
Follow up with the lead immediately!`;

    const mailOptions = {
        from: 'j40000948@gmail.com', // Sender address
        to: 'j40000948@gmail.com',   // Receiver address
        subject: subject,
        text: textContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.', error: error.message });
    }
});

// Start the server only if we aren't in a Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Export the Express API
module.exports = app;
