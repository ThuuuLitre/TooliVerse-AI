import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Copy, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptStrategy } from "@/components/prompt-strategy";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { logActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TooliVerse" },
      { name: "description", content: "Generate professional workplace emails with AI." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Informal", "Friendly", "Persuasive", "Professional"];
const AUDIENCES = ["Client", "Manager", "Team Member", "Stakeholder"];

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!topic.trim()) return toast.error("Please describe what the email is about.");
    setLoading(true);
    try {
      const res = await gen({ data: { topic, tone, audience } });
      setSubject(res.subject);
      setBody(res.body);
      logActivity("email", res.subject || topic.slice(0, 60));
      toast.success("Email drafted");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Draft polished emails in seconds. Pick tone and audience — review and copy when ready."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 shadow-card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>What is the email about?</Label>
            <Textarea
              rows={8}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Inform our client that the Q4 deliverable will be delayed by one week due to scope changes, propose a meeting to discuss next steps."
            />
          </div>
          <Button onClick={submit} disabled={loading} className="gradient-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Drafting..." : "Generate Email"}
          </Button>
          <AiDisclaimer />
        </Card>

        <Card className="p-5 shadow-card space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Subject</Label>
              {subject && (
                <Button size="sm" variant="ghost" onClick={() => copy(subject, "Subject")}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              )}
            </div>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line will appear here" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Body</Label>
              {body && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => copy(body, "Body")}>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copy(`Subject: ${subject}\n\n${body}`, "Email")}>
                    <Copy className="h-3.5 w-3.5" /> Copy All
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              rows={16}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Generated email will appear here. You can edit before copying."
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <PromptStrategy
          systemPrompt={`You are an expert business communication assistant. Write polished workplace emails.\nAlways respond as JSON with keys: subject, body.`}
          userPromptTemplate={`Write an email.\nTone: {tone}\nAudience: {audience}\nContext: {user_topic}\n\nReturn strict JSON: {"subject": "...", "body": "..."}.`}
          technique="Constrain the model with explicit JSON schema in the prompt, parameterize tone and audience to steer style, and request a ready-to-send body with sign-off placeholder. Output parsing falls back gracefully if JSON is malformed."
        />
      </div>
    </div>
  );
}
