// src/tools/transcribeAudio.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fs from "fs";
import path from "path";
// 1) import the voice provider
import { OpenAIVoice } from "@mastra/voice-openai";

export const transcribeAudio = createTool({
  id: "TranscribeAudio",
  description: `
    Transcribes a directory of MP3 chunks using OpenAI Whisper
    (via Mastra’s @mastra/voice-openai provider).
  `,
  inputSchema: z.object({
    inputDir: z
      .string()
      .describe(
        "Path to the directory containing MP3 chunk files (e.g. 'data/audioChunks')"
      ),
    projectId: z
      .string()
      .optional()
      .describe("Optional project ID to update in projectConfigs.json"),
    meetingNumber: z
      .number()
      .optional()
      .describe("Optional meeting number to record in projectConfigs.json"),
  }),
  outputSchema: z.object({
    transcriptFile: z
      .string()
      .describe("Filename of the generated transcript under data/transcripts"),
  }),
  execute: async ({ context: { inputDir, projectId, meetingNumber } }) => {
    // 2) spin up the voice wrapper once
    const voice = new OpenAIVoice({
      listeningModel: { name: "whisper-1" },
    });

    const chunkFiles = fs
      .readdirSync(inputDir)
      .filter((f) => f.endsWith(".mp3"));
    if (chunkFiles.length === 0) {
      throw new Error(`No .mp3 files found in directory: ${inputDir}`);
    }

    let transcript = "";
    for (let i = 0; i < chunkFiles.length; i++) {
      const file = chunkFiles[i];
      const filePath = path.join(inputDir, file);
      console.log(
        `▶️ Transcribing chunk ${i + 1}/${chunkFiles.length}: ${file}`
      );

      // 3) use Mastra’s voice.listen() instead of direct openai.audio
      const stream = fs.createReadStream(filePath);
      try {
        const text = await voice.listen(stream, { filetype: "mp3" });
        transcript += `\n[Chunk ${i + 1}]\n${text}\n`;
      } catch (err: any) {
        console.error(`❌ Error on chunk ${i + 1}:`, err);
      }
    }

    // 4) write out the single transcript file
    const outDir = path.resolve(process.cwd(), "data/transcripts");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const fileName = `transcript-${Date.now()}.txt`;
    const outPath = path.join(outDir, fileName);
    fs.writeFileSync(outPath, transcript, "utf8");
    console.log(`✅ Transcript written to ${outPath}`);

    // 5) (optional) update your project config here…

    return { transcriptFile: fileName };
  },
});
