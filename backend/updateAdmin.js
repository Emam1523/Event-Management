const prisma = require('./config/prisma');

async function updateAdmin() {
	try {
		const admin = await prisma.user.update({
			where: { email: 'emamhassan5662@gmail.com' },
			data: {
				role: 'admin',
				emailVerified: true,
				emailVerifiedAt: new Date()
			}
		});
		console.log('Updated user:', admin.email);
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await prisma.$disconnect();
	}
}

updateAdmin();