import { clsx } from "clsx";
import type { PropsWithChildren } from "react";

export const Panel = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <section className={clsx("rounded-lg border border-white/10 bg-white/[.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl", className)}>
    {children}
  </section>
);
