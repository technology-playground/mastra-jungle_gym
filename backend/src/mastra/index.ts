import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: "file:../mastra.db",
  }),
});
