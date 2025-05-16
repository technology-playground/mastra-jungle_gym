import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

import { constructionProjectManagerAgent } from "./agents/constructionPM";
import { runAudioPipeline } from "./tools/runAudioPipeline";
import { audioWorkflow } from "./workflows/audioWorkflow";

export const mastra = new Mastra({
  agents: {
    constructionProjectManagerAgent,
  },
  tools: {
    runAudioPipeline,
  },
  // Register vNext workflows here:
  vnext_workflows: {
    "audio-transcription": audioWorkflow,
  },
  storage: new LibSQLStore({
    url: "file:../mastra.db",
  }),
});
