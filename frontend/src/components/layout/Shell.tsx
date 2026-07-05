import { Bot, BriefcaseBusiness, LayoutDashboard, LogOut, MessageSquare, Mic2, UserRoundSearch } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "Twin Chat", icon: MessageSquare },
  { to: "/interview", label: "Interview", icon: Mic2 },
  { to: "/recruiter", label: "Recruiter", icon: UserRoundSearch },
  { to: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness }
];

export const Shell = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,.22),transparent_26%),radial-gradient(circle_at_78%_12%,rgba(6,182,212,.18),transparent_24%),linear-gradient(135deg,#030712,#10131f_52%,#050816)]" />
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:block">
        <NavLink to="/dashboard" className="mb-8 flex items-center gap-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-md bg-cyan-300 text-slate-950"><Bot size={22} /></span>
          Digital Twin Avatar
        </NavLink>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition ${isActive ? "bg-white/[.12] text-cyan-200" : "text-white/65 hover:bg-white/[.08] hover:text-white"}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-white/50">{user?.email}</p>
          </div>
          <Button variant="ghost" className="w-full" onClick={logout}><LogOut size={16} /> Sign out</Button>
        </div>
      </aside>
      <main className="px-4 py-5 lg:ml-72 lg:px-8">{children}</main>
    </div>
  );
};
