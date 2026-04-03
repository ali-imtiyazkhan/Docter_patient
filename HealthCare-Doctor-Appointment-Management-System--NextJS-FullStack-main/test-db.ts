
import prisma from "./lib/prisma";

async function test() {
  const email = "itzkhantijara@gmail.com";
  console.log("Testing email check for:", email);
  try {
    const patient = await prisma.patient.findFirst({
      where: { email },
    });
    console.log("Patient found:", patient);

    const user = await prisma.user.findFirst({
      where: { email },
    });
    console.log("User found:", user);
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
