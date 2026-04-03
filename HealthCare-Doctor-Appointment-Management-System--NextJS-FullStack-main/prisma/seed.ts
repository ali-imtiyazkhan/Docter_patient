import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  const user = await prisma.user.upsert({
    where: { email: 'itzkhantijara@gmail.com' },
    update: {},
    create: {
      id: 'cl_user_123',
      email: 'itzkhantijara@gmail.com',
      name: 'Test Patient',
      phone: '+91 8529428700',
    },
  })

  await prisma.patient.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '+91 8529428700',
      birthDate: new Date('1990-01-01'),
      gender: 'Male',
      address: '123 Main St, New Delhi',
      occupation: 'Software Engineer',
      emergencyContactName: 'John Doe',
      emergencyContactNumber: '+91 9999999999',
      primaryPhysician: 'Dr. Smith',
      insuranceProvider: 'HealthFirst',
      insurancePolicyNumber: 'HF-123456',
      privacyConsent: true,
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
