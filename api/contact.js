const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { fullName, phone, goal, timeSlot } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'j40000948@gmail.com',
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: 'j40000948@gmail.com',
        to: 'j40000948@gmail.com',
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
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message.', error: error.message });
    }
}
