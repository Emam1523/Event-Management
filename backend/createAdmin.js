const prisma = require('./config/prisma');
const bcrypt = require('bcryptjs');

async function createAdmin() {
	const args = process.argv.slice(2);
	if (args.length < 3) {
		console.log('Usage: node createAdmin.js <name> <email> <password>');
		process.exit(1);
	}

	const [name, email, password] = args;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const admin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'admin'
			}
		});

		console.log('Admin account created successfully:');
		console.log(`ID: ${admin.id}`);
		console.log(`Name: ${admin.name}`);
		console.log(`Email: ${admin.email}`);
		console.log(`Role: ${admin.role}`);
	} catch (error) {
		console.error('Error creating admin account:', error.message);
	} finally {
		await prisma.$disconnect();
	}
}

createAdmin();