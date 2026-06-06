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
	
	const htmlBody = `
	<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1a1a1a;">
		<div style="text-align: center; margin-bottom: 30px;">
			<h1 style="color: #ff5a35; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">AURA<span style="color: #ffffff;">PASS</span></h1>
		</div>
		<div style="background-color: #0f0f0f; padding: 30px; border-radius: 12px; border: 1px solid #1a1a1a;">
			<h2 style="margin-top: 0; color: #ffffff; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 20px;">Identity Verification</h2>
			<p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">Hi ${name || 'there'},</p>
			<p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">A request was made for <strong>${label}</strong>. Please use the following access code to proceed:</p>
			<div style="background: linear-gradient(135deg, #ff5a35, #ff2d55); color: #ffffff; text-align: center; padding: 24px; border-radius: 12px; font-size: 36px; font-weight: 900; letter-spacing: 10px; margin: 30px 0; box-shadow: 0 10px 25px rgba(255, 90, 53, 0.2);">
				${code}
			</div>
			<p style="color: #71717a; font-size: 14px; text-align: center; font-weight: 600;">This code will expire in 15 minutes.</p>
		</div>
		<div style="text-align: center; margin-top: 30px; color: #52525b; font-size: 12px;">
			<p>If you did not initiate this request, you can safely ignore this transmission.</p>
			<p style="margin-top: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">&copy; ${new Date().getFullYear()} AuraPass Global</p>
		</div>
	</div>
	`;

	const textBody = [
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
		text: textBody,
		html: htmlBody,
	});

	return { skipped: false };
};

const sendContactFormEmail = async ({ name, email, subject, message }) => {
	const systemEmail = process.env.SMTP_USER;
	
	if (!transporter || !systemEmail) {
		console.warn('[emailService] SMTP not configured or SMTP_USER missing. Contact message not sent.');
		return { skipped: true };
	}

	const htmlBody = `
	<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9fa; color: #18181b; padding: 40px; border-radius: 16px; border: 1px solid #e4e4e7;">
		<div style="text-align: center; margin-bottom: 30px;">
			<h1 style="color: #ff5a35; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">AURA<span style="color: #18181b;">PASS</span></h1>
			<p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-top: 8px;">Incoming Transmission</p>
		</div>
		<div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
			<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
				<tr>
					<td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; width: 100px;"><strong style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From:</strong></td>
					<td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; font-weight: 600;">${name}</td>
				</tr>
				<tr>
					<td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5;"><strong style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email:</strong></td>
					<td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; font-weight: 600;">
						<a href="mailto:${email}" style="color: #ff5a35; text-decoration: none;">${email}</a>
					</td>
				</tr>
				<tr>
					<td style="padding: 8px 0;"><strong style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Subject:</strong></td>
					<td style="padding: 8px 0; font-weight: 600;">${subject}</td>
				</tr>
			</table>
			<div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 10px;">
				<p style="margin: 0; color: #3f3f46; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${message}</p>
			</div>
		</div>
	</div>
	`;

	const textBody = `New Contact Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

	await transporter.sendMail({
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to: systemEmail, // Send to the admin/system email
		replyTo: email,  // Allow replying directly to the user
		subject: `[AuraPass Contact] ${subject}`,
		text: textBody,
		html: htmlBody,
	});

	return { skipped: false };
};

module.exports = {
	sendVerificationCodeEmail,
	sendContactFormEmail
};