import type { User } from "@mahjong/shared/types";
import { createContext } from "react";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
