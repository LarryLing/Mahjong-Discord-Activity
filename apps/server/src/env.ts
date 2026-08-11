import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DISCORD_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
