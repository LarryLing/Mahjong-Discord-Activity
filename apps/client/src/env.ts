import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    COLYSEUS_CLIENT_URL: z.url(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_APP_ENV: z.enum(["development", "production"]).default("development"),
    VITE_DISCORD_CLIENT_ID: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
