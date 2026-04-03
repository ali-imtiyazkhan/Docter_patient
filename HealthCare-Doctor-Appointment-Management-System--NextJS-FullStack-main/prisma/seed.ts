import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Create a Test Patient User
  const user1 = await prisma.user.upsert({
    where: { email: 'itzkhantijara@gmail.com' },
    update: {},
    create: {
      id: 'cl_user_123',
      email: 'itzkhantijara@gmail.com',
      name: 'Test Patient',
      phone: '+91 8529428700',
    },
  })

  const patient1 = await prisma.patient.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      id: 'cl_patient_123',
      userId: user1.id,
      name: user1.name,
      email: user1.email,
      phone: user1.phone || '+91 8529428700',
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

  // 2. Create another User & Patient
  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      id: 'cl_user_456',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+1 555-0199',
    },
  })

  const patient2 = await prisma.patient.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      id: 'cl_patient_456',
      userId: user2.id,
      name: user2.name,
      email: user2.email,
      phone: user2.phone || '+1 555-0199',
      birthDate: new Date('1985-05-15'),
      gender: 'Female',
      address: '456 Elm St, Mumbai',
      occupation: 'Designer',
      emergencyContactName: 'Richard Smith',
      emergencyContactNumber: '+91 8888888888',
      primaryPhysician: 'Dr. Jones',
      insuranceProvider: 'Star Health',
      insurancePolicyNumber: 'SH-987654',
      privacyConsent: true,
    },
  })

  //Create a third User & Patient
  const user3 = await prisma.user.upsert({
    where: { email: 'bob.johnson@example.com' },
    update: {},
    create: {
      id: 'cl_user_789',
      email: 'bob.johnson@example.com',
      name: 'Bob Johnson',
      phone: '+1 555-0200',
    },
  })

  const patient3 = await prisma.patient.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      id: 'cl_patient_789',
      userId: user3.id,
      name: user3.name,
      email: user3.email,
      phone: user3.phone || '+1 555-0200',
      birthDate: new Date('1970-12-10'),
      gender: 'Male',
      address: '789 Oak St, London',
      occupation: 'Mechanic',
      emergencyContactName: 'Alice Johnson',
      emergencyContactNumber: '+44 7700 900000',
      primaryPhysician: 'Dr. Ali',
      insuranceProvider: 'Bupa',
      insurancePolicyNumber: 'B-112233',
      privacyConsent: true,
    },
  })

  // Create Appointments
  console.log('Seeding appointments...')

  await prisma.appointment.upsert({
    where: { id: 'app_1' },
    update: {},
    create: {
      id: 'app_1',
      patientId: patient1.id,
      userId: user1.id,
      schedule: new Date(Date.now() + 86400000),
      status: 'scheduled',
      primaryPhysician: 'Dr. Smith',
      reason: 'Regular checkup',
      note: 'Patient mentioned occasional headaches.',
    },
  })

  await prisma.appointment.upsert({
    where: { id: 'app_2' },
    update: {},
    create: {
      id: 'app_2',
      patientId: patient2.id,
      userId: user2.id,
      schedule: new Date(Date.now() + 172800000), // Day after tomorrow
      status: 'pending',
      primaryPhysician: 'Dr. Jones',
      reason: 'Fever and cold',
    },
  })

  // Appointment 3: Cancelled
  await prisma.appointment.upsert({
    where: { id: 'app_3' },
    update: {},
    create: {
      id: 'app_3',
      patientId: patient3.id,
      userId: user3.id,
      schedule: new Date(Date.now() - 86400000), // Yesterday
      status: 'cancelled',
      primaryPhysician: 'Dr. Ali',
      reason: 'Ankle injury',
      cancellationReason: 'Patient recovered before the appointment.',
    },
  })

  // Appointment 4: Pending (for first patient)
  await prisma.appointment.upsert({
    where: { id: 'app_4' },
    update: {},
    create: {
      id: 'app_4',
      patientId: patient1.id,
      userId: user1.id,
      schedule: new Date(Date.now() + 259200000), // In 3 days
      status: 'pending',
      primaryPhysician: 'Dr. Smith',
      reason: 'Follow-up on blood report',
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
