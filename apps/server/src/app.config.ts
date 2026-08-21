import {
  createRouter,
  defineRoom,
  defineServer,
  monitor,
  playground,
} from "colyseus";
import cors from "cors";

import { getDiscordToken } from "./controllers/discordControllers.js";
import { env } from "./env.js";
import { WaitingRoom } from "./rooms/waiting-room/WaitingRoom.js";

const corsConfig = cors({
  origin: [env.FRONTEND_URL],
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

const server = defineServer({
  rooms: {
    waiting_room: defineRoom(WaitingRoom),
  },
  routes: createRouter({
    getDiscordToken,
  }),
  express: (app) => {
    app.use(corsConfig);
    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitoring/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/monitor", monitor());

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (env.NODE_ENV !== "production") {
      app.use("/", playground());
    }
  },
});

export default server;

export type Config = typeof server;
