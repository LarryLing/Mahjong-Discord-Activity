import { createFileRoute } from "@tanstack/react-router";

import useAuth from "@/hooks/useAuth";

import AuthDialog from "./-components/AuthDialog";

const HomeComponent = () => {
  const useAuthReturn = useAuth();

  return (
    <>
      <AuthDialog {...useAuthReturn} />
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    </>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
