import { createContext } from "react";

import type { User } from "@mahjong/shared/types/user";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

export type { AuthContextType };
