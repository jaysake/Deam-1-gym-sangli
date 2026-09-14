const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

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

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'j40000948@gmail.com',
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

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
        from: 'j40000948@gmail.com',
        to: 'j40000948@gmail.com',
        subject: subject,
        text: textContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message.', error: error.message });
    }
}
