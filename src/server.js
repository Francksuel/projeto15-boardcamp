import express from "express";
import cors from "cors";
import { categoriesRouter } from "./routers/categories.routers.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(categoriesRouter);

app.listen(4000, () => {
	console.log("Listening on port 4000");
});
