import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Check if the admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@example.com',
    },
  });

  // If admin doesn't exist, create it
  if (!existingAdmin) {
    // Hash the password
    const hashedPassword = await hash('admin123', 12);
    
    // Create the default admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('Default admin user created:', admin.email);
  } else {
    console.log('Admin user already exists, skipping creation');
  }
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });