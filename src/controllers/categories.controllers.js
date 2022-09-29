import { connection } from "../database/db.js";

const getCategories = async (req, res) => {
	const category = await connection.query("SELECT * FROM categories;");
	res.send(category.rows);
};

const addCategory = async (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.sendStatus(400);
	}

	try {
		const categories = await connection.query("SELECT * FROM categories;");
		const isRepeatName = categories.rows.filter(
			(element) => element.name === name
		);
		if (isRepeatName.length !== 0) {
			return res.sendStatus(409);
		}
		await connection.query("INSERT INTO categories (name) VALUES ($1);", [
			name,
		]);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};

export { getCategories, addCategory };
