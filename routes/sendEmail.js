const express = require('express');
const email = express.Router();
const { createTransport } = require('nodemailer');

// Create nodemailer transporter with Ethereal email service
const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cleo.dietrich88@ethereal.email',
        pass: 'GYqJzNe467wYr6mpUf'
    }
});

// Endpoint for sending email
email.post('/sendEmail', async (req, res) => {
    const { recipient, subject, text } = req.body;

    // Prepare email options
    const mailOptions = {
        from: 'noreplay@example.com', // Sender email address
        to: recipient, // Recipient email address
        subject, // Email subject
        text // Email body
    };

    // Send email using transporter
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            // Handle error if sending email fails
            return res.status(403).send({
                message: 'Oops! Something went wrong.'
            });
        } else {
            // Log success message and send response
            console.log('Email sent successfully');
            res.send('Email sent successfully');
        }
    });
});

module.exports = email;
