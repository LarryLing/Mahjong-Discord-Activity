import { JWT } from "@colyseus/auth";
import {
  type CloseCode,
  OnAuthException,
  Room,
  validate,
  type Client as WaitingRoomClient,
} from "colyseus";
import { z } from "zod";

import { type User, userSchema } from "@mahjong/shared/types";

import { WaitingRoomPlayer } from "./schema/WaitingRoomPlayer.js";
import { WaitingRoomState } from "./schema/WaitingRoomState.js";

type WaitingRoomMetadata = {
  guildId: string;
  instanceId: string;
};

type Client = WaitingRoomClient<{
  userData: User;
}>;

// TODO: Move into shared package
const MAX_TURN_DURATION = 90 as const;
const MIN_TURN_DURATION = 5 as const;

const MAX_MINIMUM_HAND_POINTS = 13 as const;
const MIN_MINIMUM_HAND_POINTS = 5 as const;

const turnDurationSchema = z
  .number()
  .min(MIN_TURN_DURATION)
  .max(MAX_TURN_DURATION);
type TurnDurationType = z.infer<typeof turnDurationSchema>;

const minimumHandPointsSchema = z
  .number()
  .min(MAX_MINIMUM_HAND_POINTS)
  .max(MIN_MINIMUM_HAND_POINTS);
type MinimumHandPointsType = z.infer<typeof minimumHandPointsSchema>;

export class WaitingRoom extends Room<{
  state: WaitingRoomState;
  metadata: WaitingRoomMetadata;
  client: Client;
}> {
  maxClients = 4;
  state = new WaitingRoomState();

  messages = {
    ready: (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.isReady = true;
    },
    "set-turn-duration": validate(
      turnDurationSchema,
      (client: Client, turnDuration: TurnDurationType) => {
        const player = this.state.players.get(client.sessionId);
        if (!player?.isHost) return;
        this.state.turnDuration = turnDuration;
      }
    ),
    "set-minimum-hand-points": validate(
      minimumHandPointsSchema,
      (client: Client, minimumHandPoints: MinimumHandPointsType) => {
        const player = this.state.players.get(client.sessionId);
        if (!player?.isHost) return;
        this.state.minimumHandPoints = minimumHandPoints;
      }
    ),
  };

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

  onDrop(client: Client, code: number) {
    console.log(`Client ${client.sessionId} dropped (code: ${code})`);

    this.allowReconnection(client, 30);

    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.isConnected = false;
    }
  }

  onReconnect(client: Client) {
    console.log(`Client ${client.sessionId} reconnected!`);

    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.isConnected = true;
    }
  }

  onLeave(client: Client, code: CloseCode) {
    console.log(`Client ${client.sessionId} left permanently (code: ${code})`);

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
