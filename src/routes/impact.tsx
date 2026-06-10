import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Clock, DollarSign, Users, Briefcase, Zap } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Productivity Impact — TooliVerse" },
      { name: "description", content: "How TooliVerse delivers measurable productivity gains." },
    ],
  }),
  component: ImpactPage,
});

const useCases = [
  { icon: Briefcase, title: "Account Managers", body: "Generate client status updates and follow-up emails in seconds instead of 10–15 minutes each." },
  { icon: Users, title: "Team Leads", body: "Convert 60-minute meeting transcripts into structured decisions and action items in under a minute." },
  { icon: Zap, title: "Operations Analysts", body: "Turn raw research and reports into executive briefs ready to share with leadership." },
];

function ImpactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<TrendingUp className="h-5 w-5" />}
        title="Productivity Impact"
        description="The workplace problem we solve, and the value AI automation unlocks."
      />

      <Card className="p-6 gradient-hero border-primary/20 shadow-card">
        <h2 className="text-xl font-semibold">The workplace problem</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Studies consistently show that knowledge workers spend 40–60% of their day on
          administrative tasks: writing emails, summarizing meetings, planning work, and
          gathering information. That's time stolen from strategic, creative, and high-value
          work. TooliVerse compresses these tasks from minutes to seconds.
        </p>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5 shadow-card">
          <Clock className="h-5 w-5 text-primary" />
          <div className="mt-3 text-3xl font-semibold gradient-text">~10×</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Faster turnaround on routine emails and summaries vs. manual drafting.
          </p>
        </Card>
        <Card className="p-5 shadow-card">
          <DollarSign className="h-5 w-5 text-success" />
          <div className="mt-3 text-3xl font-semibold gradient-text">100+ hrs</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reclaimed per knowledge worker per year, redirected to strategic work.
          </p>
        </Card>
        <Card className="p-5 shadow-card">
          <TrendingUp className="h-5 w-5 text-warning" />
          <div className="mt-3 text-3xl font-semibold gradient-text">5 tools</div>
          <p className="mt-1 text-sm text-muted-foreground">
            One unified suite replaces a fragmented stack of single-purpose apps.
          </p>
        </Card>
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Benefits of AI automation</h2>
      <Card className="p-5 shadow-card">
        <ul className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            "Consistent tone and quality across written communication",
            "Faster meeting follow-through with extracted action items",
            "Better prioritization with Eisenhower-matrix planning",
            "Reduced cognitive load on context-switching tasks",
            "Faster onboarding for graduates entering the workforce",
            "Lower risk of dropped tasks via centralized activity tracking",
          ].map((b) => (
            <li key={b} className="flex gap-2"><span className="text-primary">✓</span>{b}</li>
          ))}
        </ul>
      </Card>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Real-world use cases</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {useCases.map((u) => (
          <Card key={u.title} className="p-5 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <u.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-3 font-semibold">{u.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{u.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
