import { useEffect, useState } from "react";

import type { AuthContextType } from "@/contexts/AuthContext";

type UseAuthDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const useAuthDialog = (
  isAuthenticated: AuthContextType["isAuthenticated"],
  isLoading: AuthContextType["isLoading"]
) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsOpen(false);
    }
  }, [isAuthenticated, isLoading]);

  return {
    isOpen,
    setIsOpen,
  };
};

export default useAuthDialog;

export type { UseAuthDialogReturn };
