import pg from "pg";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const connection = new Pool({
	connectionString: process.env.DATABASE_URL,
});

app.get("/categories", async (req, res) => {
	const category = await connection.query("SELECT * FROM categories;");
	res.send(category.rows);
});

app.post("/categories", async (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.sendStatus(400);
	}

	try {
		const categories = await connection.query("SELECT * FROM categories;");
		console.log(categories.rows);
		const isRepeatName = categories.rows.filter(
			(element) => element.name === name
		);
		if (isRepeatName.length !== 0) {
			return res.sendStatus(409);
		}
		const response = await connection.query(
			"INSERT INTO categories (name) VALUES ($1);",
			[name]
		);
		res.send(response);
	} catch {
		res.sendStatus(500);
	}
});

app.listen(4000, () => {
	console.log("Listening on port 4000");
});
