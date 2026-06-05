const nodemailer = require('nodemailer');

const hasSmtpConfig = Boolean(
	process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

const transporter = hasSmtpConfig
	? nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT || 587),
			secure: String(process.env.SMTP_SECURE || 'false') === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})
	: null;

const subjectByPurpose = {
	registration: 'Verify your email address',
	'password-change': 'Confirm your password change',
	checkout: 'Verify your email before checkout',
	'email-update': 'Verify your new email address',
};

const labelByPurpose = {
	registration: 'account registration',
	'password-change': 'password change',
	checkout: 'ticket checkout',
	'email-update': 'email update',
};

const sendVerificationCodeEmail = async ({ to, name, code, purpose }) => {
	const subject = subjectByPurpose[purpose] || 'Verification code';
	const label = labelByPurpose[purpose] || 'verification';
	const body = [
		`Hi ${name || 'there'},`,
		'',
		`Your ${label} code is: ${code}`,
		'',
		'This code expires in 15 minutes.',
		'If you did not request this, you can ignore this email.',
	].join('\n');

	if (!transporter) {
		console.warn(`[emailService] SMTP not configured. Code for ${to}: ${code}`);
		return { skipped: true };
	}

	await transporter.sendMail({
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to,
		subject,
		text: body,
	});

	return { skipped: false };
};

module.exports = {
	sendVerificationCodeEmail,
};
