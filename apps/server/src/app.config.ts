import {
  createRouter,
  defineRoom,
  defineServer,
  monitor,
  playground,
} from "colyseus";

import { getDiscordToken } from "./controllers/discordControllers.js";
import { env } from "./env.js";
import { MyRoom } from "./rooms/MyRoom.js";

const server = defineServer({
  rooms: {
    my_room: defineRoom(MyRoom),
  },
  routes: createRouter({
    getDiscordToken,
  }),
  express: (app) => {
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
