import { createFileRoute, Link } from "@tanstack/react-router";

import UserBadge from "@/components/shared/UserBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

import AuthDialog from "./-components/AuthDialog";

const HomeComponent = () => {
  const useAuthReturn = useAuth();
  const { user } = useAuthReturn;

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        <div className="w-full min-h-16 flex justify-end items-center px-12 p-2">
          {user != null && <UserBadge {...user} />}
        </div>
        <div className="w-full flex-1 flex justify-center items-center gap-8 px-12">
          <div className="flex-1 h-full flex justify-center items-center p-4 border-2 border-solid ">
            Image placeholder
          </div>
          <div className="flex-1 h-full flex flex-col justify-center items-center gap-4 p-4 border-2 border-solid">
            <h1 className="text-4xl font-bold">Mahjong.</h1>
            <p className="font-bold">Placeholder text</p>
            <Link to="/">
              <Button className="text-lg font-bold w-[200px] h-[60px]">
                Create Game
              </Button>
            </Link>
            <Link to="/">
              <Button
                className="text-lg font-bold w-[200px] h-[60px]"
                variant="outline"
              >
                Find Games
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-4 p-2">
          <a
            className={buttonVariants({ variant: "link", size: "sm" })}
            href="#"
            rel="noreferrer"
            target="_blank"
          >
            Terms of Service
          </a>
          <a
            className={buttonVariants({ variant: "link", size: "sm" })}
            href="#"
            rel="noreferrer"
            target="_blank"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <AuthDialog {...useAuthReturn} />
    </>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
