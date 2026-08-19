import { createFileRoute } from "@tanstack/react-router";

import UserBadge from "@/components/shared/UserBadge";
import useAuth from "@/hooks/useAuth";

import AuthDialog from "./-components/AuthDialog";

const HomeComponent = () => {
  const useAuthReturn = useAuth();
  const { user } = useAuthReturn;

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div>Image placeholder</div>
        <div>
          <UserBadge {...user} />
        </div>
      </div>
      <AuthDialog {...useAuthReturn} />
    </>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
