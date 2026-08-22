import { z } from "zod";

import type { User } from "../types/user.js";

const MAX_TURN_DURATION = 90 as const;
const MIN_TURN_DURATION = 5 as const;

const MAX_MINIMUM_HAND_POINTS = 13 as const;
const MIN_MINIMUM_HAND_POINTS = 5 as const;

type CreateWaitingRoomOptions = {
  channelId: string;
  hostUser: User;
};

const turnDurationPayloadSchema = z.object({
  turnDuration: z.number().min(MIN_TURN_DURATION).max(MAX_TURN_DURATION),
});

type TurnDurationPayload = z.infer<typeof turnDurationPayloadSchema>;

const minimumHandPointsPayloadSchema = z.object({
  minimumHandPoints: z
    .number()
    .min(MAX_MINIMUM_HAND_POINTS)
    .max(MIN_MINIMUM_HAND_POINTS),
});

type MinimumHandPointsPayload = z.infer<typeof minimumHandPointsPayloadSchema>;

const MESSAGE_NAMES = {
  READY: "ready",
  SET_TURN_DURATION: "set_turn_duration",
  SET_MINIMUM_HAND_POINTS: "set_minimum_hand_points",
} as const;

export {
  type CreateWaitingRoomOptions,
  MAX_MINIMUM_HAND_POINTS,
  MAX_TURN_DURATION,
  MESSAGE_NAMES,
  MIN_MINIMUM_HAND_POINTS,
  MIN_TURN_DURATION,
  type MinimumHandPointsPayload,
  minimumHandPointsPayloadSchema,
  type TurnDurationPayload,
  turnDurationPayloadSchema,
};
