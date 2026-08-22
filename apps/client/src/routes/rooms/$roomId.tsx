import { useRoom, useRoomState } from "@colyseus/react";
import { createFileRoute } from "@tanstack/react-router";

import useAuth from "@/hooks/useAuth";
import { colyseusClient } from "@/lib/colyseus";

const RoomComponent = () => {
  const { roomId } = Route.useParams();

  const { user } = useAuth();

  const { room, error, isConnecting } = useRoom(() =>
    colyseusClient.joinOrCreate("waiting_room", { roomId, hostUser: user })
  );

  const state = useRoomState(room);

  if (isConnecting) return <p>Connecting...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!state) return <p>Waiting for state...</p>;

  return <div>Room {roomId}</div>;
};

export const Route = createFileRoute("/rooms/$roomId")({
  component: RoomComponent,
});
