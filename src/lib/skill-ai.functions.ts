import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  kind: z.enum(["mapping", "roadmap"]),
  targetRole: z.string().min(2).max(120),
  currentSkills: z.array(z.string().max(80)).max(30),
});

type SkillMapping = {
  summary: string;
  groups: { priority: string; skills: { name: string; reason: string }[] }[];
};

type AiRoadmap = {
  summary: string;
  phases: { title: string; duration: string; items: string[] }[];
};

function cleanJson(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
}

export const generateSkillPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<SkillMapping | AiRoadmap> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("SkillBridge AI is not configured.");

    const shape = data.kind === "mapping"
      ? '{"summary":"...","groups":[{"priority":"Core","skills":[{"name":"...","reason":"..."}]}]}'
      : '{"summary":"...","phases":[{"title":"...","duration":"...","items":["..."]}]}';
    const prompt = `Return only valid JSON matching ${shape}. Create a practical ${data.kind === "mapping" ? "skill gap map" : "24-week learning roadmap"} for a student targeting the role: ${data.targetRole}. Current profile skills: ${data.currentSkills.join(", ") || "none"}. Keep it concise, specific, employable, and use 3 groups or 4 phases.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: prompt,
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      let message = body;
      try {
        const parsed = JSON.parse(body) as { message?: string; error?: { message?: string } };
        message = parsed.message ?? parsed.error?.message ?? body;
      } catch {
        // Keep the gateway response text.
      }
      throw new Error(message || `SkillBridge AI request failed (${response.status}).`);
    }

    if (!response.body) throw new Error("SkillBridge AI returned no result.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let output = "";
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        for (const line of event.split("\n")) {
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          try {
            const payload = JSON.parse(line.slice(6)) as { type?: string; delta?: string };
            if (payload.type === "response.output_text.delta" && payload.delta) output += payload.delta;
          } catch {
            // Ignore non-JSON stream metadata.
          }
        }
      }
    }

    try {
      return JSON.parse(cleanJson(output)) as SkillMapping | AiRoadmap;
    } catch {
      throw new Error("SkillBridge AI returned an unreadable result. Please try again.");
    }
  });