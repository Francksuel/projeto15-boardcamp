import express from "express";
import { addGame, getGames } from "../controllers/games.controllers.js";
import { gameValidationSchema } from "../middlewares/game.middleware.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games",gameValidationSchema, addGame);

export { gamesRouter };