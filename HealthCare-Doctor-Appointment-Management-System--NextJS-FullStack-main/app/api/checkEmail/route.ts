import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // 1. Check if patient exists
    const patient = await prisma.patient.findFirst({
      where: { email },
    });

    if (patient) {
      return NextResponse.json({ 
        exists: true, 
        userId: patient.userId, 
        isPatient: true,
        user: patient 
      });
    }

    // 2. Check if user exists but not registered as patient
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      return NextResponse.json({ 
        exists: true, 
        userId: user.id, 
        isPatient: false,
        user: user 
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("CheckEmail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
