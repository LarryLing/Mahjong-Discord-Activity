import { Schema, type } from "@colyseus/schema";

export class BasePlayer extends Schema {
  @type("string") id: string = "";
  @type("string") username: string = "";
  @type("string") avatar: string | null | undefined;

  @type("int64") joinTime = 0;
}
