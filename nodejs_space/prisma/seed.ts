import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('vJzS1vyA*g', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'abacus-a7d2e349@example.com' },
    update: {},
    create: {
      email: 'abacus-a7d2e349@example.com',
      password: hashedPassword,
      name: 'Test Admin',
      plan: {
        create: {
          tier: 'PRO',
          aiQueriesUsed: 0,
          subscriptionCount: 0,
        },
      },
    },
  });

  console.log('Seeded test user:', testUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
