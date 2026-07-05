import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileUp, Globe2, Link2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Panel } from "../../components/ui/Panel";
import { api } from "../../lib/api";

type DocumentSummary = {
  id: string;
  title: string;
  source: string;
  kind: string;
  metadata: { skills?: string[]; projects?: string[]; wordCount?: number };
  createdAt: string;
};

export const DashboardPage = () => {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();
  const documents = useQuery({
    queryKey: ["documents"],
    queryFn: async () => (await api.get<DocumentSummary[]>("/documents")).data
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", file.name.toLowerCase().includes("resume") ? "resume" : "document");
      return api.post("/documents/upload", form);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] })
  });

  const ingestUrl = useMutation({
    mutationFn: async () => api.post("/documents/url", { url, kind: url.includes("github") ? "github" : "portfolio" }),
    onSuccess: () => {
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[.25em] text-cyan-200">Knowledge base</p>
        <h1 className="mt-2 text-4xl font-bold">Teach the twin your professional memory.</h1>
      </header>
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Panel>
          <h2 className="text-lg font-semibold">Upload evidence</h2>
          <label className="mt-5 grid cursor-pointer place-items-center rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center hover:bg-white/10">
            <FileUp className="mb-3 text-cyan-200" />
            <span className="font-semibold">Drop a resume, certificate, PDF, TXT, DOCX, or Markdown file</span>
            <input className="hidden" type="file" onChange={(event) => event.target.files?.[0] && upload.mutate(event.target.files[0])} />
          </label>
          <div className="mt-5 flex gap-2">
            <input className="field" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Portfolio, LinkedIn, or GitHub URL" />
            <Button onClick={() => ingestUrl.mutate()} disabled={!url || ingestUrl.isPending}><Link2 size={17} /></Button>
          </div>
          {(upload.isPending || ingestUrl.isPending) && <p className="mt-4 flex items-center gap-2 text-sm text-cyan-200"><Loader2 className="animate-spin" size={16} /> Processing memory</p>}
        </Panel>
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Sources</h2>
            <span className="text-sm text-white/50">{documents.data?.length ?? 0} documents</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {documents.data?.map((doc) => (
              <article key={doc.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <Globe2 className="mt-1 text-cyan-200" size={18} />
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{doc.title}</h3>
                    <p className="truncate text-xs text-white/45">{doc.source}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/60">{doc.metadata.wordCount ?? 0} words extracted</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {doc.metadata.skills?.slice(0, 6).map((skill) => <span key={skill} className="rounded bg-white/10 px-2 py-1 text-xs">{skill}</span>)}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};
