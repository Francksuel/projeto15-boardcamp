import express from "express";
import { getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { rentalValidationSchema } from "../middlewares/rental.middleware.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals",getRentals);
rentalsRouter.post("/rentals", rentalValidationSchema, insertRental);
rentalsRouter.post("/rentals/:id/return");
rentalsRouter.delete("/rentals/:id");

export { rentalsRouter };
