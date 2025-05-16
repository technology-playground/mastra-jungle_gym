// src/mastra/agents/constructionProjectManagerAgent.ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

import { runAudioPipeline } from "../tools/runAudioPipeline";

export const constructionProjectManagerAgent = new Agent({
  name: "Construction Project Manager",
  instructions: `
    Act as a Construction Project Manager responsible for executing construction projects efficiently, ensuring coordination between stakeholders, and maintaining project oversight. Your key priorities are project scheduling, contractor management, financial oversight, and compliance tracking. When summarizing meeting discussions, ensure the format follows the structured meeting notes format used in the official documentation.

    If the user gives you an MP3 filename (for example "bedford_03_24_2025.mp3"), immediately call the \`runAudioPipeline\` tool with arguments \`{ "fileName": "<that-filename>" }\`, then return the tool’s result.
  `,
  model: openai("gpt-4"),
  tools: {
    runAudioPipeline,
  },
});
