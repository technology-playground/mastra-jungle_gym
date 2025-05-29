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
      console.error("❌ runAudioPipeline: no fileName in context");
      throw new Error("No fileName provided to runAudioPipeline");
    }
    if (!mastra) {
      throw new Error("Mastra instance missing in execution context");
    }

    // 1) grab your vNext workflow
    const wf = mastra.vnext_getWorkflow("audio-transcription");
    if (!wf) {
      console.error("❌ runAudioPipeline: workflow not found");
      throw new Error("Workflow not found: audio-transcription");
    }

    // 2) create a run (do NOT destructure start—keep the full `run` object)
    const run = wf.createRun();
    console.log(
      `▶️ Starting workflow 'audio-transcription' (runId=${run.runId}) with fileName=${fileName}`
    );

    // 3) call run.start(), so “this.executionEngine” is defined
    let result;
    try {
      result = await run.start({
        inputData: { fileName },
      });
    } catch (err: any) {
      console.error("❌ runAudioPipeline.start() threw:", err);
      throw err;
    }

    // 4) handle failure vs success
    if (result.status === "failed") {
      console.error("❌ audio-transcription failed:", result.error);
      throw result.error;
    }
    if (result.status !== "success") {
      console.error("❌ unexpected status:", result.status);
      throw new Error(`Unexpected workflow status: ${result.status}`);
    }

    console.log("✅ audio-transcription succeeded; report:", result.result);
    return { report: result.result };
  },
});
