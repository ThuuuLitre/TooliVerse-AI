import { createServerFn } from "@tanstack/react-start";
import { generateText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  return gateway(MODEL);
}

async function run(system: string, user: string) {
  try {
    const { text } = await generateText({
      model: getModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return { text };
  } catch (e) {
    const err = e as { statusCode?: number; message?: string };
    const status = err.statusCode;
    if (status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (status === 402) throw new Error("AI credits exhausted. Please add credits in your Lovable workspace.");
    throw new Error(err.message || "AI request failed");
  }
}

// ---------- Email Generator ----------
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { topic: string; tone: string; audience: string }) => d)
  .handler(async ({ data }) => {
    const system = `You are an expert business communication assistant. Write polished workplace emails.
Always respond as JSON with keys: subject, body. No markdown fences.`;
    const user = `Write an email.
Tone: ${data.tone}
Audience: ${data.audience}
Context / purpose: ${data.topic}

Return strict JSON: {"subject": "...", "body": "..."}.
The body should be ready-to-send, include greeting and sign-off placeholder [Your Name].`;
    const { text } = await run(system, user);
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      return { subject: parsed.subject ?? "", body: parsed.body ?? "" };
    } catch {
      return { subject: "Generated Email", body: text };
    }
  });

// ---------- Meeting Summarizer ----------
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: { notes: string }) => d)
  .handler(async ({ data }) => {
    const system = `You analyze meeting notes/transcripts and extract structured output.
Return strict JSON with keys: summary (string), keyPoints (string[]), decisions (string[]), actionItems (Array<{task:string, owner:string, deadline:string}>).
No markdown fences.`;
    const user = `Meeting notes:\n\n${data.notes}`;
    const { text } = await run(system, user);
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return { summary: text, keyPoints: [], decisions: [], actionItems: [] };
    }
  });

// ---------- Task Planner ----------
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: { tasks: string }) => d)
  .handler(async ({ data }) => {
    const system = `You are a productivity coach using the Eisenhower Matrix.
Categorize tasks into four quadrants and produce a schedule.
Return strict JSON with keys:
- urgentImportant: Array<{task:string, estMinutes:number}>
- importantNotUrgent: Array<{task:string, estMinutes:number}>
- urgentLessImportant: Array<{task:string, estMinutes:number}>
- lowPriority: Array<{task:string, estMinutes:number}>
- dailySchedule: Array<{time:string, task:string}>
- weeklyPlan: Array<{day:string, focus:string}>
- tips: string[]
No markdown fences.`;
    const user = `Tasks (one per line or comma separated):\n${data.tasks}`;
    const { text } = await run(system, user);
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return {
        urgentImportant: [], importantNotUrgent: [], urgentLessImportant: [],
        lowPriority: [], dailySchedule: [], weeklyPlan: [], tips: [text],
      };
    }
  });

// ---------- Research Assistant ----------
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: { content: string }) => d)
  .handler(async ({ data }) => {
    const system = `You are a research analyst. Given a topic or pasted content, produce a structured brief.
Return strict JSON with keys:
- executiveSummary (string)
- keyInsights (string[])
- recommendations (string[])
- simplifiedExplanation (string)
- importantFindings (string[])
No markdown fences.`;
    const user = `Topic / content:\n\n${data.content}`;
    const { text } = await run(system, user);
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return {
        executiveSummary: text, keyInsights: [], recommendations: [],
        simplifiedExplanation: "", importantFindings: [],
      };
    }
  });

// ---------- Chatbot ----------
export const chatbot = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Array<{ role: "user" | "assistant"; content: string }> }) => d)
  .handler(async ({ data }) => {
    const system = `You are TooliVerse Assistant, an AI workplace productivity helper.
Help with email writing, meeting summaries, task planning, research, and general workplace productivity questions.
Be concise, friendly, and actionable. Use markdown for structure when helpful.`;
    const messages: ModelMessage[] = [
      { role: "system", content: system },
      ...data.messages.map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
    ];
    try {
      const { text } = await generateText({ model: getModel(), messages });
      return { text };
    } catch (e) {
      const err = e as { statusCode?: number; message?: string };
      if (err.statusCode === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (err.statusCode === 402) throw new Error("AI credits exhausted.");
      throw new Error(err.message || "AI request failed");
    }
  });
