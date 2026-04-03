import { redirect } from "next/navigation";

import {
  getUserByEmail,
  getPatientByEmail,
  updatePatientUserId,
} from "@/lib/actions/patient.actions";

interface FindByEmailPageProps {
  searchParams: { email: string };
}

const FindByEmailPage = async ({ searchParams }: FindByEmailPageProps) => {
  const { email } = searchParams;
  if (!email) {
    redirect("/");
  }

  const user = await getUserByEmail(email);
  const patient = await getPatientByEmail(email);

  if (user && patient) {
    if (patient.userId !== user.id) {
      await updatePatientUserId(patient.id, user.id);
    }
    redirect(`/patients/${user.id}/register`);
  } else if (user) {
    redirect(`/patients/${user.id}/register`);
  } else {
    redirect("/");
  }
};

export default FindByEmailPage;
