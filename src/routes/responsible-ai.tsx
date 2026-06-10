import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Lock, Scale, Eye, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — TooliVerse" },
      { name: "description", content: "Our principles for responsible AI use." },
    ],
  }),
  component: ResponsibleAi,
});

const principles = [
  { icon: AlertTriangle, title: "Accuracy is not guaranteed", body: "AI-generated content may contain factual errors, outdated information, or subtle misrepresentations. Always verify important facts before acting on them." },
  { icon: UserCheck, title: "Human judgment first", body: "AI outputs assist, not replace, professional judgment. Critical decisions — legal, financial, personnel — must be reviewed and owned by a qualified human." },
  { icon: Lock, title: "Privacy", body: "Do not paste confidential, regulated, or personally identifiable information you are not authorized to share. Inputs are sent to AI providers for processing." },
  { icon: Eye, title: "Transparency", body: "Every AI surface in TooliVerse shows a disclaimer banner, and the 'Prompt Strategy' panel reveals the exact instructions sent to the model." },
  { icon: Scale, title: "Ethical use", body: "Do not use TooliVerse to generate deceptive, harmful, discriminatory, or impersonating content. Use AI to amplify good work, not to mislead." },
  { icon: ShieldCheck, title: "Safe defaults", body: "Activity history is stored only in your browser. No content is persisted server-side beyond the duration of the request." },
];

function ResponsibleAi() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Responsible AI"
        description="How TooliVerse approaches safety, transparency, and ethical use."
      />

      <Card className="p-5 border-warning/40 bg-warning/10">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
          <div>
            <h3 className="font-semibold">Use AI as a co-pilot, not an autopilot</h3>
            <p className="mt-1 text-sm">
              Treat every AI output as a draft that requires review. The model can sound
              confident even when wrong.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title} className="p-5 shadow-card">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">{p.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
