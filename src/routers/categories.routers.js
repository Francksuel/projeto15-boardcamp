import express from "express";
import {
	addCategory,
	getCategories,
} from "../controllers/categories.controllers.js";
import { categoryValidationSchema } from "../middlewares/category.middleware.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories",categoryValidationSchema, addCategory);

export { categoriesRouter };
