try {
    console.log('Testing dotenv...');
    require('dotenv').config();
    console.log('✅ dotenv loaded. DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');
} catch (e) {
    console.error('❌ dotenv failed:', e.message);
}

try {
    console.log('Testing prisma client...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    console.log('✅ PrismaClient imported');
} catch (e) {
    console.error('❌ PrismaClient failed:', e.message);
}

try {
    console.log('Testing bcryptjs...');
    const bcrypt = require('bcryptjs');
    console.log('✅ bcryptjs imported');
} catch (e) {
    console.error('❌ bcryptjs failed:', e.message);
}
