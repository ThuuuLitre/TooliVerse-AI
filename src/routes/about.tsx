import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles, ShieldCheck, Layers, Lightbulb, Target } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TooliVerse" },
      { name: "description", content: "About TooliVerse — AI workplace productivity suite." },
    ],
  }),
  component: AboutPage,
});

const sections = [
  {
    icon: Target, title: "Project Objective",
    body: "TooliVerse is an AI-powered productivity suite designed to reduce time spent on repetitive workplace tasks — drafting emails, summarizing meetings, planning work, and conducting research — so professionals can focus on high-impact decisions.",
  },
  {
    icon: Layers, title: "Core Features",
    body: "Smart Email Generator, Meeting Notes Summarizer, AI Task Planner with Eisenhower prioritization, AI Research Assistant, and a conversational Workplace Chatbot. A unified dashboard tracks usage and estimated time saved.",
  },
  {
    icon: Sparkles, title: "AI Tools Used",
    body: "Built on Lovable AI Gateway with Google Gemini Flash. The Vercel AI SDK powers structured generation and tool routing. Server-side functions (TanStack Start) keep all model keys and prompts off the client.",
  },
  {
    icon: Lightbulb, title: "Prompt Engineering Approach",
    body: "Each tool uses persona priming, schema-locked JSON output, and parameterized inputs (tone, audience, task lists). The 'Prompt Strategy' panel on every page reveals the exact system prompt, user template, and refinement technique.",
  },
  {
    icon: ShieldCheck, title: "Responsible AI Practices",
    body: "Disclaimer banners on every AI surface, no persistent storage of sensitive content, browser-local activity logs only, and clear guidance that AI outputs supplement — never replace — professional judgment.",
  },
  {
    icon: Target, title: "Expected Business Value",
    body: "For a knowledge worker generating 5 emails, 2 summaries, and 1 planning session per day, TooliVerse can reclaim 30–60 minutes daily — translating to 100+ hours per year per user, redirected from administration toward strategic work.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<Info className="h-5 w-5" />}
        title="About TooliVerse"
        description="Automating work. Amplifying productivity."
      />

      <Card className="p-6 shadow-card gradient-hero border-primary/20">
        <h2 className="text-xl font-semibold">An AI Skills Accelerator final project</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          TooliVerse demonstrates practical applications of generative AI for the modern
          workplace — combining thoughtful prompt engineering, a polished SaaS UX, and
          responsible AI principles into a single presentation-ready product.
        </p>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title} className="p-5 shadow-card">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
