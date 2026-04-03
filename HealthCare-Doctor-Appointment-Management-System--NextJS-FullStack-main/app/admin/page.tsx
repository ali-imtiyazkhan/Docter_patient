"use client";

// import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import GlobalLoading from "@/components/GlobalLoading";
import { StatCard } from "@/components/StatCard";
import { Columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { motion } from "framer-motion";

import { PatientModal } from "../../components/PatientModal";

const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [appointments, setAppointments] = useState<any>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getRecentAppointmentList();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const openModal = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
  };

  if (!appointments) {
    return <GlobalLoading text="Loading appointments..." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14 pb-12">
      <header className="admin-header glassmorphism mt-6 backdrop-blur-lg border-white/10">
        <Link href="/" className="cursor-pointer">
          <img
            src="/assets/icons/logo-full.svg"
            width={160}
            height={32}
            alt="CarePulse Logo"
            className="h-8 w-fit"
            loading="eager"
            decoding="async"
          />
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-8 w-[1px] bg-dark-500/50" />
          <p className="text-16-semibold text-dark-700">Admin Dashboard</p>
        </div>
      </header>

      <main className="admin-main z-10 relative">
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full space-y-4"
        >
          <div className="flex flex-col gap-2">
            <h1 className="header text-white">
              Welcome Back, <span className="text-gradient">Admin</span> 👋
            </h1>
            <p className="text- dark-700 max-w-md">
              Here's what's happening with your appointments today.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="admin-stat text-dark-700 w-full"
        >
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled"
            icon={"/assets/icons/cancelled.svg"}
          />
        </motion.section>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <DataTable
            columns={Columns({
              openModal,
              isModalOpen,
              selectedPatientId,
              closeModal,
            })}
            data={appointments.documents}
          />
        </motion.div>
      </main>

      {isModalOpen && (
        <PatientModal patientId={selectedPatientId} closeModal={closeModal} />
      )}
    </div>
  );
};

export default AdminPage;
