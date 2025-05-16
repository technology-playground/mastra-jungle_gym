import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export const chunkAudio = createTool({
  id: "ChunkAudio",
  description: `
    Splits a single audio file into 5-minute MP3 segments for downstream transcription.
    The input file must live under data/audioInput.
    Chunks are written to data/audioChunks.
  `,
  inputSchema: z.object({
    fileName: z
      .string()
      .describe(
        "Name of the MP3 file in data/audioInput (e.g. 'site-meeting.mp3')"
      ),
  }),
  outputSchema: z.object({
    chunkFiles: z
      .array(z.string())
      .describe("List of generated chunk filenames"),
  }),
  execute: async ({ context: { fileName } }) => {
    console.log("chunkAudio got fileName:", fileName);
    if (!fileName) {
      throw new Error("No fileName provided to chunkAudio");
    }

    const inputDir = path.resolve(process.cwd(), "../../data/audioInput");
    const chunksDir = path.resolve(process.cwd(), "../../data/audioChunks");
    const chunkLength = 300; // seconds

    if (!fs.existsSync(inputDir)) {
      throw new Error(`Input directory not found: ${inputDir}`);
    }
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir, { recursive: true });
    }

    const inputPath = path.join(inputDir, fileName);
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Audio file not found: ${inputPath}`);
    }
    const outputPattern = path.join(
      chunksDir,
      `${path.basename(fileName, ".mp3")}_chunk_%03d.mp3`
    );

    execSync(
      `ffmpeg -i "${inputPath}" -f segment -segment_time ${chunkLength} -c copy "${outputPattern}"`,
      { stdio: "inherit" }
    );

    const chunkFiles = fs
      .readdirSync(chunksDir)
      .filter(
        (f) =>
          f.startsWith(path.basename(fileName, ".mp3")) && f.endsWith(".mp3")
      );

    return { chunkFiles };
  },
});
