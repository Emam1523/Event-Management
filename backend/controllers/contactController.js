const asyncHandler = require('../utils/asyncHandler');
const { sendContactFormEmail } = require('../services/emailService');


exports.submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, subject, message');
  }

  const result = await sendContactFormEmail({ name, email, subject, message });

  if (result.skipped) {
    res.status(500);
    throw new Error('Email service is not configured properly.');
  }

  res.status(200).json({ success: true, message: 'Your message has been sent successfully.' });
});
