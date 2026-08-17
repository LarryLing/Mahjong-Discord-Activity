import { env } from "../env";

const getFullApiRoute = (apiRoute: string) => {
  return `${env.VITE_COLYSEUS_CLIENT_URL}${apiRoute}`;
};

export { getFullApiRoute };
