import { useContext } from "react";
import DiscordContext from "@/contexts/DiscordContext";

const useDiscord = () => {
  const discordContext = useContext(DiscordContext);

  if (!discordContext) {
    throw new Error("useDiscord must be used within a DiscordProvider");
  }

  return discordContext;
};

export default useDiscord;
