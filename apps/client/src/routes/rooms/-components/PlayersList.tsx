import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { useRoomState } from "@/contexts/WaitingRoomContext";

import PlayerItem from "./PlayerItem";

const PlayersList = () => {
  const players = useRoomState((state) => state.players);
  const hostId = useRoomState((state) => state.hostId);

  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Players</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ItemGroup className="overflow-y-auto">
          {players !== undefined &&
            Object.values(players).map((player) => {
              return (
                <PlayerItem
                  key={player.id}
                  {...player}
                  isHost={player.id === hostId}
                />
              );
            })}
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default PlayersList;
