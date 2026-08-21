import { createEndpoint } from "colyseus";

import {
  CREATE_WAITING_ROOM_ROUTE,
  createWaitingRoomRequestBodySchema,
} from "@mahjong/shared/api/createWaitingRoom";

import HttpCodes from "../constants/http.js";
import { tryCatch } from "../lib/result.js";
import { createWaitingRoomService } from "../services/roomServices.js";

const createWaitingRoom = createEndpoint(
  CREATE_WAITING_ROOM_ROUTE,
  {
    method: "POST",
    body: createWaitingRoomRequestBodySchema,
  },
  async (ctx) => {
    const [error, result] = await tryCatch(createWaitingRoomService(ctx.body));

    if (error == null) {
      ctx.setStatus(HttpCodes.OK);
      return ctx.json(result);
    }

    const { reason } = error;

    switch (reason) {
      case "QueryRoomError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Failed to query for room",
        });
      }
      case "CreateRoomError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Failed to create room",
        });
      }
      case "InvalidResponseData": {
        return ctx.error(HttpCodes.INTERNAL_SERVER_ERROR, {
          message: "Invalid response data",
        });
      }
      case "UnexpectedError": {
        return ctx.error(HttpCodes.INTERNAL_SERVER_ERROR, {
          message: "Something went wrong",
        });
      }
      default: {
        throw new Error(`Unhandled error: ${reason satisfies never}`);
      }
    }
  }
);

export { createWaitingRoom };
