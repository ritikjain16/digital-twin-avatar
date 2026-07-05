import { clsx } from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }>;

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={clsx(
      "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60",
      variant === "primary" && "bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,.25)] hover:bg-white",
      variant === "ghost" && "border border-white/10 bg-white/5 text-white hover:bg-white/10",
      variant === "danger" && "bg-rose-400 text-slate-950 hover:bg-rose-300",
      className
    )}
    {...props}
  />
);
