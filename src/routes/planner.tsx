import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Wand2, Clock, Calendar, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptStrategy } from "@/components/prompt-strategy";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TooliVerse" },
      { name: "description", content: "Prioritize tasks and build a daily/weekly schedule with AI." },
    ],
  }),
  component: PlannerPage,
});

interface Item { task: string; estMinutes: number }
interface Result {
  urgentImportant: Item[];
  importantNotUrgent: Item[];
  urgentLessImportant: Item[];
  lowPriority: Item[];
  dailySchedule: Array<{ time: string; task: string }>;
  weeklyPlan: Array<{ day: string; focus: string }>;
  tips: string[];
}

function Quadrant({ title, color, items }: { title: string; color: string; items: Item[] }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tasks</p>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {items.map((i, idx) => (
            <li key={idx} className="flex items-start justify-between gap-2">
              <span>{i.task}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{i.estMinutes}m</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!tasks.trim()) return toast.error("Enter at least one task.");
    setLoading(true);
    try {
      const r = await fn({ data: { tasks } });
      setResult(r as Result);
      logActivity("plan", `Planned ${tasks.split("\n").filter(Boolean).length} tasks`);
      toast.success("Plan ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner & Scheduler"
        description="Drop your todo list. Get an Eisenhower matrix, daily schedule, and weekly focus."
      />

      <Card className="p-5 shadow-card space-y-3">
        <Label>Your tasks (one per line)</Label>
        <Textarea
          rows={6}
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder={"Prepare Q4 budget review\nReply to vendor emails\nUpdate project roadmap\nResearch competitor pricing"}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={submit} disabled={loading} className="gradient-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Planning..." : "Generate Plan"}
          </Button>
        </div>
        <AiDisclaimer />
      </Card>

      {result && (
        <>
          <h2 className="mt-8 mb-3 text-lg font-semibold">Eisenhower Matrix</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Quadrant title="Urgent & Important" color="bg-destructive/5 border-destructive/30" items={result.urgentImportant} />
            <Quadrant title="Important, Not Urgent" color="bg-primary/5 border-primary/30" items={result.importantNotUrgent} />
            <Quadrant title="Urgent, Less Important" color="bg-warning/10 border-warning/30" items={result.urgentLessImportant} />
            <Quadrant title="Low Priority" color="bg-muted border-border" items={result.lowPriority} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-5 shadow-card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" /> Daily Schedule
              </h3>
              <div className="space-y-2">
                {result.dailySchedule.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{s.time}</span>
                    <span>{s.task}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4 text-primary" /> Weekly Plan
              </h3>
              <div className="space-y-2">
                {result.weeklyPlan.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="w-24 shrink-0 font-medium">{s.day}</span>
                    <span className="text-muted-foreground">{s.focus}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {result.tips?.length > 0 && (
            <Card className="mt-6 p-5 shadow-card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-warning" /> Productivity Tips
              </h3>
              <ul className="space-y-2 text-sm">
                {result.tips.map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">→</span>{t}</li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      <div className="mt-6">
        <PromptStrategy
          systemPrompt={`You are a productivity coach using the Eisenhower Matrix. Categorize tasks and produce a schedule.\nReturn JSON with quadrants, dailySchedule, weeklyPlan and tips arrays.`}
          userPromptTemplate={`Tasks:\n{user_tasks}`}
          technique="Role-priming ('productivity coach') anchors style. Schema-locked output ensures four quadrants are always populated for consistent UI rendering. Estimated minutes per task enable schedule generation."
        />
      </div>
    </div>
  );
}
