import { type } from "@colyseus/schema";

import { BasePlayer } from "../../schema/BasePlayer.js";

export class WaitingRoomPlayer extends BasePlayer {
  @type("boolean") isReady = false;
}
