// src/mastra/workflows/audioTranscription.ts
import { createWorkflow, createStep } from "@mastra/core/workflows/vNext";
import { z } from "zod";
import { chunkAudio } from "../tools/chunkAudio";

// 1. Wrap your tool as a vNext step
const chunkAudioStep = createStep(chunkAudio);

export const audioWorkflow = createWorkflow({
  id: "audio-transcription",
  inputSchema: z.object({
    fileName: z.string().describe("MP3 file in data/audioInput"),
  }),
  outputSchema: z.object({
    chunkFiles: z
      .array(z.string())
      .describe("List of generated audio chunk filenames"),
  }),
  steps: [chunkAudioStep], // <-- declare your steps for TS safety
})
  .then(chunkAudioStep) // <-- only one argument here
  .commit();
