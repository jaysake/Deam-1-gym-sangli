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

// API Endpoint for Contact Form
app.post('/api/contact', async (req, res) => {
    const { fullName, phone, goal, timeSlot } = req.body;

    const mailOptions = {
        from: 'j40000948@gmail.com', // Sender address
        to: 'j40000948@gmail.com', // Receiver address
        subject: `New Lead from DREAM 1 GYM: ${fullName}`,
        text: `You have received a new trial registration form submission.

Details:
- Full Name: ${fullName}
- WhatsApp / Phone Number: ${phone}
- Primary Fitness Goal: ${goal}
- Preferred Time Slot: ${timeSlot}

Log into your system to follow up!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
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
