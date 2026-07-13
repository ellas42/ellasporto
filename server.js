
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

app.post('/submit-form.php', async (req, res) => {
    try {
        const { name, email, company, projectType, budget, timeline, message } = req.body;

        const errors = [];
        if (!name || name.trim() === '') errors.push('Name is required');
        if (!email || email.trim() === '') {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Invalid email format');
        }
        if (!projectType || projectType.trim() === '') errors.push('Project type is required');
        if (!message || message.trim() === '') errors.push('Project details are required');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        const mailOptions = {
            from: process.env.SMTP_USER || 'hello@kndr.site',
            to: process.env.RECIPIENT_EMAIL || 'hello@kndr.site',
            subject: `New Client Application: ${projectType}`,
            text: `
New Client Application Received

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Project Type: ${projectType}
Budget Range: ${budget || 'Not specified'}
Timeline: ${timeline || 'Not specified'}

Project Details:
${message}
            `.trim(),
            replyTo: email
        };

        await transporter.sendMail(mailOptions);

        const logEntry = `${new Date().toISOString()} - New application from: ${name} (${email}) - Project: ${projectType}\n`;
        fs.appendFileSync('applications.log', logEntry);

        res.json({
            success: true,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process your application. Please try again later.'
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Note: Update email configuration in server.js to enable email sending');
});


