import { JWT } from "@colyseus/auth";
import {
  type CloseCode,
  OnAuthException,
  Room,
  validate,
  type Client as WaitingRoomClient,
} from "colyseus";

import {
  MESSAGE_NAMES,
  type MinimumHandPointsPayload,
  minimumHandPointsPayloadSchema,
  type TurnDurationPayload,
  turnDurationPayloadSchema,
} from "@mahjong/shared/rooms/waitingRoom";
import { type User, userSchema } from "@mahjong/shared/types/user";

import { WaitingRoomPlayer } from "./schema/WaitingRoomPlayer.js";
import { WaitingRoomState } from "./schema/WaitingRoomState.js";

type WaitingRoomMetadata = {
  guildId: string;
  instanceId: string;
};

type Client = WaitingRoomClient<{
  userData: User;
}>;

type MessageName = (typeof MESSAGE_NAMES)[keyof typeof MESSAGE_NAMES];

export class WaitingRoom extends Room<{
  state: WaitingRoomState;
  metadata: WaitingRoomMetadata;
  client: Client;
}> {
  maxClients = 4;
  state = new WaitingRoomState();

  messages = {
    [MESSAGE_NAMES.READY]: (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.isReady = true;
    },
    [MESSAGE_NAMES.SET_TURN_DURATION]: validate(
      turnDurationPayloadSchema,
      (client: Client, payload: TurnDurationPayload) => {
        const player = this.state.players.get(client.sessionId);
        if (!player?.isHost) return;
        const { turnDuration } = payload;
        this.state.turnDuration = turnDuration;
      }
    ),
    [MESSAGE_NAMES.SET_MINIMUM_HAND_POINTS]: validate(
      minimumHandPointsPayloadSchema,
      (client: Client, payload: MinimumHandPointsPayload) => {
        const player = this.state.players.get(client.sessionId);
        if (!player?.isHost) return;
        const { minimumHandPoints } = payload;
        this.state.minimumHandPoints = minimumHandPoints;
      }
    ),
  } satisfies Record<MessageName, unknown>;

  static async onAuth(token: string, _options: unknown, _context: unknown) {
    const tokenData = await JWT.verify(token);

    const user = userSchema.parse(tokenData);

    return user as User;
  }

  onJoin(client: Client, _options: unknown, auth: User) {
    console.log(`Client ${client.sessionId} joined!`);

    client.userData = auth;

    const player = new WaitingRoomPlayer();
    player.id = auth?.id;
    player.username = auth?.username;
    player.avatar = auth?.avatar;
    player.isHost = this.state.players.size === 0;
    player.isConnected = true;
    player.joinTime = Date.now();

    this.state.players.set(client.sessionId, player);

    if (this.state.players.size === this.maxClients) {
      this.lock();
    }
  }

  onLeave(client: Client, code: CloseCode) {
    console.log(`Client ${client.sessionId} left (code: ${code})`);

    const leftPlayer = this.state.players.get(client.sessionId);
    if (!leftPlayer) return;

    this.state.players.delete(client.sessionId);

    if (this.locked && this.state.players.size < this.maxClients) {
      this.unlock();
    }

    if (!leftPlayer.isHost || this.state.players.size === 0) return;

    const nextHost = Array.from(this.state.players.values()).reduce<
      WaitingRoomPlayer | undefined
    >(
      (candidate, player) =>
        !candidate || candidate.joinTime < player.joinTime ? player : candidate,
      undefined
    );

    if (nextHost) {
      nextHost.isHost = true;
    }
  }

  onUncaughtException(err: Error, methodName: string) {
    if (err instanceof OnAuthException) {
      console.error(`${methodName} error: invalid auth token`);
    }
  }
}
