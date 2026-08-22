import { MapSchema, Schema, type } from "@colyseus/schema";

import { WaitingRoomPlayer } from "./WaitingRoomPlayer.js";

export class WaitingRoomState extends Schema {
  @type("string") hostId = "";

  @type({ map: WaitingRoomPlayer }) players =
    new MapSchema<WaitingRoomPlayer>();

  @type("number") turnDuration = 30;
  @type("number") minimumHandPoints = 3;
}
