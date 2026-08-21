import { z } from "zod";

import { userSchema } from "../types/user.js";

const CREATE_WAITING_ROOM_ROUTE = "/waiting-room" as const;

const createWaitingRoomRequestBodySchema = z.object({
  channelId: z.string().min(1),
  hostUser: userSchema,
  isPublic: z.boolean(),
});

type CreateWaitingRoomRequestBody = z.infer<
  typeof createWaitingRoomRequestBodySchema
>;

const createWaitingRoomResponseDataSchema = z.object({
  roomId: z.string().min(1),
});

type CreateWaitingRoomResponseData = z.infer<
  typeof createWaitingRoomResponseDataSchema
>;

export {
  CREATE_WAITING_ROOM_ROUTE,
  type CreateWaitingRoomRequestBody,
  type CreateWaitingRoomResponseData,
  createWaitingRoomRequestBodySchema,
  createWaitingRoomResponseDataSchema,
};
