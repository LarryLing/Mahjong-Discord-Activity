import type { User } from "@mahjong/shared/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserBadgeProps = User;

const UserBadge = ({ id, username, avatar }: UserBadgeProps) => {
  const imgSrc = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;

  return (
    <div className="flex justify-center items-center gap-2">
      <Avatar className="size-12">
        <AvatarImage alt={username} src={imgSrc} />
        <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <p className="font-bold">{username}</p>
    </div>
  );
};

export default UserBadge;
