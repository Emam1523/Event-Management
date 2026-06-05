const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.event.count();
    console.log('Event Count:', count);
    const users = await prisma.user.count();
    console.log('User Count:', users);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
