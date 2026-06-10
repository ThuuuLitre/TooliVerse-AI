import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Download, Loader2, Wand2, CheckCircle2, ListTodo, Users } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptStrategy } from "@/components/prompt-strategy";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — TooliVerse" },
      { name: "description", content: "Summarize meeting notes and extract actions." },
    ],
  }),
  component: SummarizerPage,
});

interface ActionItem { task: string; owner: string; deadline: string }
interface Result {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
}

function SummarizerPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes to summarize.");
    setLoading(true);
    try {
      const r = await fn({ data: { notes } });
      setResult(r as Result);
      logActivity("summary", `Meeting summary (${notes.length} chars)`);
      toast.success("Summary ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const exportText = () => {
    if (!result) return;
    const lines = [
      "MEETING SUMMARY", "=".repeat(40), result.summary, "",
      "KEY POINTS", "-".repeat(40), ...result.keyPoints.map((p) => `• ${p}`), "",
      "DECISIONS", "-".repeat(40), ...result.decisions.map((d) => `• ${d}`), "",
      "ACTION ITEMS", "-".repeat(40),
      ...result.actionItems.map((a) => `• ${a.task} — Owner: ${a.owner} — Due: ${a.deadline}`),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste meeting notes or a transcript. Get a structured summary with decisions and action items."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-card space-y-3">
          <Label>Meeting notes or transcript</Label>
          <Textarea
            rows={18}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your raw notes or transcript here..."
          />
          <Button onClick={submit} disabled={loading} className="gradient-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Summarizing..." : "Summarize"}
          </Button>
          <AiDisclaimer />
        </Card>

        <Card className="p-5 shadow-card space-y-5">
          {!result && (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground text-center">
              Your structured summary will appear here.
            </div>
          )}
          {result && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Summary</h3>
                <Button size="sm" variant="outline" onClick={exportText}>
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>

              {result.keyPoints?.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Key Discussion Points
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {result.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-2"><span className="text-primary">•</span>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.decisions?.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Decisions Made
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {result.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2"><span className="text-success">•</span>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.actionItems?.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                    <ListTodo className="h-4 w-4 text-warning" /> Action Items
                  </h4>
                  <div className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <div key={i} className="rounded-md border bg-muted/40 p-3 text-sm">
                        <div className="font-medium">{a.task}</div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{a.owner || "Unassigned"}</span>
                          <span>Due: {a.deadline || "TBD"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <PromptStrategy
          systemPrompt={`Extract structured output from meeting notes.\nReturn JSON: { summary, keyPoints[], decisions[], actionItems[{task, owner, deadline}] }`}
          userPromptTemplate={`Meeting notes:\n{user_notes}`}
          technique="Use schema-driven prompting: explicit JSON keys force consistent structure for downstream UI rendering. Owner and deadline are nested fields to allow grouping and reminders."
        />
      </div>
    </div>
  );
}
