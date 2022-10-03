import express from "express";
import {
	deleteRent,
	finishRent,
	getRentals,
	insertRent,
} from "../controllers/rentals.controllers.js";
import { rentValidationSchema } from "../middlewares/rent.middleware.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", rentValidationSchema, insertRent);
rentalsRouter.post("/rentals/:id/return", finishRent);
rentalsRouter.delete("/rentals/:id", deleteRent);

export { rentalsRouter };
