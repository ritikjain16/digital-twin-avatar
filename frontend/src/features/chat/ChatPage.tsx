import { Mic, Send, Square } from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { DigitalHuman } from "../../components/avatar/DigitalHuman";
import { Button } from "../../components/ui/Button";
import { Panel } from "../../components/ui/Panel";
import { api, type ChatMode } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

type Message = { role: "user" | "assistant"; content: string };

export const ChatPage = ({ mode }: { mode: ChatMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const token = useAuthStore((state) => state.token);
  const title = useMemo(() => (mode === "recruiter" ? "Recruiter Q&A" : mode === "portfolio" ? "Portfolio Mode" : "Twin Chat"), [mode]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((current) => [...current, { role: "user", content: userMessage }, { role: "assistant", content: "" }]);
    setSpeaking(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:8080/api"}/chat/stream`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: userMessage, mode })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n\n").filter(Boolean);
      for (const line of lines) {
        const data = JSON.parse(line.replace(/^data: /, ""));
        if (data.token) {
          setMessages((current) => current.map((message, index) => index === current.length - 1 ? { ...message, content: message.content + data.token } : message));
        }
      }
    }
    setSpeaking(false);
  };

  const speak = async () => {
    const last = [...messages].reverse().find((message) => message.role === "assistant");
    if (!last) return;
    const response = await api.post("/voice/tts", { text: last.content }, { responseType: "blob" });
    if (response.data.type === "audio/mpeg") {
      const audio = new Audio(URL.createObjectURL(response.data));
      setSpeaking(true);
      audio.onended = () => setSpeaking(false);
      await audio.play();
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
      <Panel className="flex min-h-[calc(100vh-48px)] flex-col">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[.25em] text-cyan-200">{mode}</p>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <Button variant="ghost" onClick={speak}><Mic size={17} /> Speak</Button>
        </div>
        <div className="flex-1 space-y-4 overflow-auto pr-1">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-2xl rounded-lg bg-cyan-300 p-4 text-slate-950" : "max-w-3xl rounded-lg bg-white/[.08] p-4"}>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{message.content || "Thinking..."}</ReactMarkdown>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <textarea className="field min-h-24 resize-none" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask your twin about experience, projects, tradeoffs, or interview stories." />
          <Button className="h-auto w-14" onClick={send}>{speaking ? <Square size={18} /> : <Send size={18} />}</Button>
        </div>
      </Panel>
      <div className="space-y-5">
        <DigitalHuman speaking={speaking} emotion={mode === "recruiter" ? "focused" : "happy"} />
        <Panel>
          <h2 className="font-semibold">Conversation controls</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">Responses stream from the API, retrieve profile memory, and update avatar speech state.</p>
        </Panel>
      </div>
    </div>
  );
};
