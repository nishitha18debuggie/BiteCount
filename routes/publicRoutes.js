const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Home Page
router.get('/', (req, res) => {
  res.render('home', { title: 'Home - BiteCount', currentPage: 'home' });
});

// About Page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - BiteCount', currentPage: 'about' });
});

// Services Page
router.get('/services', (req, res) => {
  res.render('services', { title: 'Our Services - BiteCount', currentPage: 'services' });
});

// Contact Page
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us - BiteCount', currentPage: 'contact', errors: null, success: null });
});

// Handle Contact Form Submission
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('contact', {
      title: 'Contact Us - BiteCount',
      currentPage: 'contact',
      errors: errors.array(),
      success: null
    });
  }

  try {
    const { name, email, message } = req.body;

    // Save to database
    const contact = new Contact({
      name,
      email,
      message
    });
    await contact.save();

    // Send email notification (optional - requires email configuration)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }
    }

    res.render('contact', {
      title: 'Contact Us - BiteCount',
      currentPage: 'contact',
      errors: null,
      success: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.render('contact', {
      title: 'Contact Us - BiteCount',
      currentPage: 'contact',
      errors: [{ msg: 'An error occurred. Please try again later.' }],
      success: null
    });
  }
});

module.exports = router;
