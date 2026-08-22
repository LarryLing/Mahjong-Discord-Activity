import { createFileRoute } from "@tanstack/react-router";

import UserBadge from "@/components/shared/UserBadge";
import { RoomProvider, useRoom } from "@/contexts/WaitingRoomContext";
import useAuth from "@/hooks/useAuth";
import { colyseusClient } from "@/lib/colyseus";

import type { WaitingRoomState } from "../../../../server/src/rooms/waiting-room/schema/WaitingRoomState";
import PlayersList from "./-components/PlayersList";

const RoomComponent = () => {
  const { roomId } = Route.useParams();

  const { user } = useAuth();

  const { error, isConnecting } = useRoom();

  return (
    <RoomProvider
      connect={() =>
        colyseusClient.joinOrCreate<WaitingRoomState>("waiting_room", {
          roomId,
          hostUser: user,
        })
      }
    >
      <div className="w-full h-screen flex flex-col">
        <div className="w-full min-h-16 flex justify-end items-center px-12 p-2">
          {user != null && <UserBadge {...user} />}
        </div>
        <div className="w-full flex-1 flex justify-center items-center gap-8 px-12 pb-12">
          <PlayersList />
          <div className="flex-1 h-full flex flex-col justify-center items-center gap-4 p-4" />
        </div>
      </div>
    </RoomProvider>
  );
};

export const Route = createFileRoute("/rooms/$roomId")({
  component: RoomComponent,
});
