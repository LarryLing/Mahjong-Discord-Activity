import { Schema, type } from "@colyseus/schema";

export class BasePlayer extends Schema {
  @type("string") id: string | undefined;
  @type("string") username: string | undefined;
  @type("string") avatar: string | null | undefined;

  @type("boolean") isHost = false;
  @type("boolean") isConnected = false;
  @type("int64") joinTime = 0;
}
