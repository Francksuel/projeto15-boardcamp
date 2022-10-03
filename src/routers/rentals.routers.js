import express from "express";
import { finishRental, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { rentalValidationSchema } from "../middlewares/rental.middleware.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals",getRentals);
rentalsRouter.post("/rentals", rentalValidationSchema, insertRental);
rentalsRouter.post("/rentals/:id/return", finishRental);
rentalsRouter.delete("/rentals/:id");

export { rentalsRouter };
