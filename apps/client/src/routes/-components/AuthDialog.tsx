import { LoaderCircle } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AuthContextType } from "@/contexts/AuthContext";

import useAuthDialog from "../-hooks/useAuthDialog";

type AuthDialogProps = Pick<
  AuthContextType,
  "isAuthenticated" | "isLoading" | "error"
>;

const AuthDialog = ({ isAuthenticated, isLoading, error }: AuthDialogProps) => {
  const { isOpen, setIsOpen } = useAuthDialog(isAuthenticated, isLoading);

  return (
    <Dialog disablePointerDismissal onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="p-8" showCloseButton={false}>
        <div className="flex flex-col justify-center items-center gap-6">
          <h1 className="text-4xl font-bold">Mahjong.</h1>
          <div className="flex justify-center items-center gap-2">
            {error == null ? (
              <>
                <p className="text-md font-bold">Loading...</p>
                <LoaderCircle className="size-5 animate-spin" strokeWidth={3} />
              </>
            ) : (
              <p className="text-md font-bold">
                Failed to authenticate: {error}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
