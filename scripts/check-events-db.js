const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Get DATABASE_URL from .env
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function checkEvents() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        isPublished: true,
        category: true
      },
      orderBy: { startDate: 'desc' }
    });
    
    console.log('Total Events:', events.length);
    console.log('\nEvents Details:');
    events.forEach((event, i) => {
      console.log(`\n${i + 1}. ${event.title}`);
      console.log(`   ID: ${event.id}`);
      console.log(`   Start Date: ${event.startDate.toISOString()}`);
      console.log(`   End Date: ${event.endDate?.toISOString() || 'N/A'}`);
      console.log(`   Published: ${event.isPublished}`);
      console.log(`   Category: ${event.category}`);
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`\nToday's Date (00:00:00): ${today.toISOString()}`);
    
    const publishedFutureEvents = events.filter(e => 
      e.isPublished && e.startDate >= today
    );
    console.log(`\nPublished Future Events: ${publishedFutureEvents.length}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkEvents();