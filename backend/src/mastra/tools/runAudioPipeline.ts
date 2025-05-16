// src/tools/runAudioPipeline.ts
import path from "path";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const runAudioPipeline = createTool({
  id: "RunAudioPipeline",
  description: "End-to-end: chunk → transcribe → categorize → assemble report",
  inputSchema: z.object({
    fileName: z.string().describe("MP3 in data/audioInput"),
  }),
  outputSchema: z.object({
    report: z.any(),
  }),
  execute: async ({ context: { fileName }, mastra }) => {
    if (!fileName) {
      console.error("❌ runAudioPipeline: context.fileName is", fileName);
      throw new Error("No fileName provided to runAudioPipeline");
    }
    // 1) grab the workflow
    const wf = mastra!.getWorkflow("audio-transcription");
    if (!wf) throw new Error("Workflow not found");

    // 2) pass it in *exactly* under triggerData
    const run = wf.createRun();
    const { results } = await run.start({
      input: { fileName }, // ← pass your workflow inputs here
    });
    // ...
    return { report: results };
  },
});
