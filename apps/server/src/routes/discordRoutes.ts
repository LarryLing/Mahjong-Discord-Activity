import { Router } from "express";

import { getDiscordToken } from "../controllers/discordControllers.js";

const router = Router();

router.post("/token", getDiscordToken);

export default router;
