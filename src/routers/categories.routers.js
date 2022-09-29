import express from "express";
import {
	addCategory,
	getCategories,
} from "../controllers/categories.controllers.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", addCategory);

export { categoriesRouter };
