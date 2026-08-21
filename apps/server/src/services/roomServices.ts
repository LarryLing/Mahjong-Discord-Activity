import { type IRoomCache, matchMaker } from "colyseus";

import {
  type CreateWaitingRoomRequestBody,
  createWaitingRoomResponseDataSchema,
} from "@mahjong/shared/api/createWaitingRoom";

import { err, ok } from "../lib/result.js";

const createWaitingRoomService = async (
  requestBody: CreateWaitingRoomRequestBody
) => {
  const { channelId, hostUser, isPublic } = requestBody;

  let existingRooms: IRoomCache[];
  try {
    existingRooms = await matchMaker.query({
      name: "waiting_room",
      channelId,
    });
  } catch {
    return err({ reason: "QueryRoomError" as const });
  }

  let roomId: string | undefined;

  if (existingRooms.length > 0) {
    roomId = existingRooms[0].roomId;
  } else {
    try {
      roomId = (
        await matchMaker.createRoom("waiting_room", {
          channelId,
          hostUser,
          isPublic,
        })
      ).roomId;
    } catch {
      let retryRooms: IRoomCache[];
      try {
        retryRooms = await matchMaker.query({
          name: "waiting_room",
          channelId,
        });
      } catch {
        return err({ reason: "QueryRoomError" as const });
      }
      if (retryRooms.length > 0) {
        roomId = retryRooms[0].roomId;
      } else {
        return err({ reason: "CreateRoomError" as const });
      }
    }
  }

  const parsedResponseData = createWaitingRoomResponseDataSchema.safeParse({
    roomId,
  });

  if (!parsedResponseData.success) {
    return err({ reason: "InvalidResponseData" as const });
  }

  return ok(parsedResponseData.data);
};

export { createWaitingRoomService };
