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

app.get("/categories", async(req, res) => {
    const category = await connection.query('SELECT * FROM categories;');    
	res.send(category.rows);
});

app.listen(4000, () => {
	console.log("Listening on port 4000");
});
