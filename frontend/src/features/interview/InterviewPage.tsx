import { useMutation } from "@tanstack/react-query";
import { Award, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Panel } from "../../components/ui/Panel";
import { api } from "../../lib/api";

type Report = {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  feedback: string[];
  nextQuestion: string;
};

export const InterviewPage = () => {
  const [question, setQuestion] = useState("Explain a complex project you built and the architecture decisions behind it.");
  const [answer, setAnswer] = useState("");
  const [role, setRole] = useState("Senior Full Stack Engineer");
  const evaluate = useMutation({
    mutationFn: async () => (await api.post<Report>("/interview/evaluate", { role, question, answer })).data
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <Panel>
        <p className="text-sm uppercase tracking-[.25em] text-cyan-200">Interview mode</p>
        <h1 className="mt-2 text-3xl font-bold">Practice with grounded evaluation.</h1>
        <div className="mt-6 grid gap-4">
          <input className="field" value={role} onChange={(event) => setRole(event.target.value)} />
          <textarea className="field min-h-24" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <textarea className="field min-h-60" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Record or type your answer." />
          <Button onClick={() => evaluate.mutate()} disabled={!answer || evaluate.isPending}><Send size={17} /> Evaluate answer</Button>
        </div>
      </Panel>
      <Panel>
        <Award className="text-cyan-200" />
        <h2 className="mt-3 text-xl font-semibold">Report</h2>
        {evaluate.data ? (
          <div className="mt-5 space-y-5">
            {[
              ["Technical", evaluate.data.technicalScore],
              ["Communication", evaluate.data.communicationScore],
              ["Confidence", evaluate.data.confidenceScore]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div>
                <div className="mt-2 h-2 rounded bg-white/10"><div className="h-2 rounded bg-cyan-300" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
            <ul className="space-y-2 text-sm text-white/70">
              {evaluate.data.feedback.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="rounded-lg bg-white/[.08] p-3 text-sm text-white/75">{evaluate.data.nextQuestion}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/55">Your scorecard appears after evaluation.</p>
        )}
      </Panel>
    </div>
  );
};
