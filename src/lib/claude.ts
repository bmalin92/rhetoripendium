import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import {
  buildSystemPrompt,
  buildUserPrompt,
  clampEvaluationScores,
  evaluationSchema,
  type Evaluation,
  type EvaluationRequestInput,
} from "@/lib/evaluation/schema";

const client = new Anthropic();

export async function evaluateSubmission(
  input: EvaluationRequestInput
): Promise<Evaluation> {
  const message = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(evaluationSchema),
    },
    system: [
      {
        type: "text",
        text: buildSystemPrompt(),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });

  if (!message.parsed_output) {
    throw new Error("Claude response did not include parsed_output");
  }

  return clampEvaluationScores(evaluationSchema.parse(message.parsed_output));
}
