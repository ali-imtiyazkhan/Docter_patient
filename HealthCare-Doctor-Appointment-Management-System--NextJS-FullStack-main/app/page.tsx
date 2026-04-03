/* eslint-disable @next/next/no-img-element */
"use client";
// Replaced next/image with native img for Vercel quota
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
const AdminLink = dynamic(() => import("@/components/AdminLink"), {
  ssr: false,
});

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  // Returning patient dialog state
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetData, setTargetData] = useState<any>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReturningPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/checkEmail?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (data.exists) {
        startTransition(() => {
          if (data.isPatient) {
            router.push(`/patients/${data.userId}/new-appointment`);
          } else {
            router.push(`/patients/${data.userId}/register`);
          }
        });
      } else {
        setError("No patient found with that email.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-dark-200 h-screen max-h-screen overflow-hidden relative">
      <Navbar />
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[20%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto z-10">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sub-container max-w-[496px]"
        >
          <div className="mb-12 flex flex-col gap-2">
            <h1 className="header text-white">
              Health Care <span className="text-gradient">Redefined</span>
            </h1>
            <p className="text-16-regular text-dark-700">
              Schedule your appointment in seconds.
            </p>
          </div>

          <PatientForm />

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <div className="w-full h-[1px] bg-dark-500/50" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-dark-600">
                Already registered or made an appointment?
              </span>
              <Button
                variant="outline"
                className={`shad-gray-btn rounded-xl w-full border-dark-500/50 hover:bg-dark-300 transition-all${isPending ? " cursor-not-allowed opacity-50" : ""}`}
                onClick={() => {
                  startTransition(() => setOpen(true));
                }}
                type="button"
                disabled={isPending}
              >
                {isPending ? "Continuing..." : "Returning Patient?"}
              </Button>
            </div>
          </motion.div>

          <footer className="text-14-regular mt-16 flex justify-between items-center opacity-60">
            <p className="text-dark-600">© 2024 CarePulse</p>
            <AdminLink className="text-green-500 hover:underline" />
          </footer>
        </motion.div>
      </section>

      {/* Returning Patient Dialog */}
      <Dialog open={open} onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setError("");
        }
      }}>
        <DialogContent className="max-w-[400px] border-dark-500 bg-dark-400">
          <DialogHeader>
            <DialogTitle className="text-white">
              Returning Patient
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReturningPatient} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shad-input border-dark-500 text-white"
            />
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            <DialogFooter className="pt-2">
               <Button
                type="submit"
                className={`shad-primary-btn w-full${loading || isPending ? " cursor-not-allowed opacity-50" : ""}`}
                disabled={loading || isPending}
              >
                {loading || isPending ? "Verifying..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative side-img max-w-[50%] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark-200 to-transparent z-10" />
        <img
          src="/assets/images/onboarding-img.webp"
          width={800}
          height={600}
          alt="Onboarding"
          className="h-full w-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
          loading="eager"
          decoding="async"
        />
        <div className="absolute bottom-12 left-12 z-20 glass-card p-6 max-w-sm">
          <p className="text-18-bold text-white mb-2 italic">
            "Your health is our priority. Expert care is just a click away."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <img src="/assets/icons/check.svg" className="h-5 w-5" alt="check" />
            </div>
            <span className="text-14-medium text-dark-700">Trusted by 50,000+ patients</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
