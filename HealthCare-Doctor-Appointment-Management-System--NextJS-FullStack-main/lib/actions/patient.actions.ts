"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID,
  ENDPOINT,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import prisma from "../prisma";

// CREATE APPWRITE USER AND PRISMA USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // 1. Create in Appwrite Auth (for continuation of current auth flow)
    let appwriteUser;
    try {
      appwriteUser = await users.create(
        ID.unique(),
        user.email,
        undefined,
        undefined,
        user.name
      );
    } catch (error: any) {
      if (error && error.code === 409) {
        const existing = await users.list([Query.equal("email", [user.email])]);
        appwriteUser = existing.users[0];
      } else {
        throw error;
      }
    }

    // 2. Create/Update in Prisma DB
    const prismaUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, phone: user.phone },
      create: { 
        id: appwriteUser?.$id || ID.unique(), 
        email: user.email, 
        name: user.name, 
        phone: user.phone 
      },
    });

    return parseStringify(prismaUser);
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // 1. Upload file to Appwrite Storage (retaining storage functionality)
    let file;
    let publicUrl = null;
    if (identificationDocument) {
      const blobEntry = identificationDocument.get("blobFile");
      const fileName = identificationDocument.get("fileName") as string;
      if (blobEntry && blobEntry instanceof Blob) {
        const inputFile = InputFile.fromBuffer(blobEntry, fileName);
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        if (file?.$id) {
          publicUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`;
        }
      }
    }

    // 2. Create new patient record in Prisma
    const { $id, ...patientData } = patient;
    const newPatient = await prisma.patient.create({
      data: {
        ...patientData,
        userId: patient.userId,
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: publicUrl,
        birthDate: new Date(patient.birthDate),
      },
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: { user: true },
    });
    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    return null;
  }
};

// --- Utility functions for returning patient logic ---

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user by email:",
      error
    );
    return null;
  }
};

export const getPatientByEmail = async (email: string) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: { email },
    });
    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient by email:",
      error
    );
    return null;
  }
};

export const updatePatientUserId = async (
  patientId: string,
  userId: string
) => {
  try {
    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { userId },
    });
    return parseStringify(updated);
  } catch (error) {
    console.error("An error occurred while updating patient userId:", error);
    return null;
  }
};
