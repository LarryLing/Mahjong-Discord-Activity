import { Client } from "@colyseus/sdk";

import { env } from "@/env";

import type { Config } from "../../../server/src/app.config";

export const colyseusClient = new Client<Config>(env.VITE_COLYSEUS_CLIENT_URL);
