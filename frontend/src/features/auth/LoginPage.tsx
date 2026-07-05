import { Github, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Panel } from "../../components/ui/Panel";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

type AuthForm = { name: string; email: string; password: string };

export const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { register, handleSubmit, formState } = useForm<AuthForm>({ defaultValues: { name: "Ritik Jain", email: "ritik@example.com", password: "password123" } });
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const { data } = await api.post(endpoint, values);
    setSession(data.user, data.token);
    navigate("/dashboard");
  });

  return (
    <main className="grid min-h-screen place-items-center bg-[#030712] px-4 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,.25),transparent_28%),radial-gradient(circle_at_75%_80%,rgba(6,182,212,.16),transparent_28%)]" />
      <Panel className="w-full max-w-md">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your twin"}</h1>
        <p className="mt-2 text-sm text-white/60">Authenticate to manage your knowledge base, avatar, and conversation memory.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {mode === "register" && <input className="field" placeholder="Name" {...register("name", { required: true })} />}
          <input className="field" placeholder="Email" type="email" {...register("email", { required: true })} />
          <input className="field" placeholder="Password" type="password" {...register("password", { required: true, minLength: 8 })} />
          <Button className="w-full" disabled={formState.isSubmitting}><LogIn size={17} /> Continue</Button>
        </form>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="ghost"><Github size={16} /> GitHub</Button>
          <Button variant="ghost">Google</Button>
        </div>
        <button className="mt-5 text-sm text-cyan-200" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create account" : "Use existing account"}
        </button>
      </Panel>
    </main>
  );
};
