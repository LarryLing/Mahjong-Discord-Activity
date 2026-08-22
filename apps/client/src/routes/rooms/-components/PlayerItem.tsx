import { Crown, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import type { WaitingRoomPlayer } from "../../../../../server/src/rooms/waiting-room/schema/WaitingRoomPlayer";

type PlayerItemProps = Pick<
  WaitingRoomPlayer,
  "id" | "username" | "avatar" | "isReady"
> & {
  isHost?: boolean;
};

const PlayerItem = ({
  id,
  username,
  avatar,
  isReady,
  isHost = false,
}: PlayerItemProps) => {
  const imgSrc = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

  return (
    <Item variant="outline">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage alt={username} src={imgSrc} />
          <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-bold">{username}</ItemTitle>
        <ItemDescription>{isReady ? "Ready" : "Not Ready"}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {isHost ? (
          <Crown className="size-4" />
        ) : (
          <Button aria-label="Kick player" size="icon-sm" variant="outline">
            <X />
          </Button>
        )}
      </ItemActions>
    </Item>
  );
};

export default PlayerItem;
