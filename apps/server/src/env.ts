import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

const DefaultPort = 2567 as const;

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(DefaultPort),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
