import { createFileRoute } from "@tanstack/react-router";

import useAuth from "@/hooks/useAuth";

const HomeComponent = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {!!isLoading && <p>Loading...</p>}
      {!!error && <p>{error}</p>}
      {!!user && isAuthenticated && (
        <p>{`ID: ${user.id} | Username: ${user.username}`}</p>
      )}
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
