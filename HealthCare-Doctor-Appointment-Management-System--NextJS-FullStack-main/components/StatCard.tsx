/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
// Replaced next/image with native img for Vercel quota

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
};

export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group", {
        "bg-appointments/10 border-green-500/20 shadow-green-500/5": type === "appointments",
        "bg-pending/10 border-blue-500/20 shadow-blue-500/5": type === "pending",
        "bg-cancelled/10 border-red-500/20 shadow-red-500/5": type === "cancelled",
      })}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full bg-inherit" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={clsx("p-2 rounded-lg", {
          "bg-green-500/20": type === "appointments",
          "bg-blue-500/20": type === "pending",
          "bg-red-500/20": type === "cancelled",
        })}>
          <img
            src={icon}
            height={32}
            width={32}
            alt={label}
            className="size-8"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h2 className="text-32-bold text-white group-hover:text-green-500 transition-colors uppercase">{count}</h2>
      </div>

      <p className="text-14-medium text-dark-700 relative z-10 group-hover:text-white transition-colors">{label}</p>
    </div>
  );
};
