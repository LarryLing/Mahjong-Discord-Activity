import { createRoomContext } from "@colyseus/react";

import type { WaitingRoomState } from "../../../server/src/rooms/waiting-room/schema/WaitingRoomState";

export const { RoomProvider, useRoom, useRoomState } =
  createRoomContext<WaitingRoomState>();
