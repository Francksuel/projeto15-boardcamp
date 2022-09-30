import { connection } from "../database/db.js";

const getCategories = async (req, res) => {
	const categories = await connection.query("SELECT * FROM categories;");
	res.send(categories.rows);
};

const addCategory = async (req, res) => {
	const { name } = res.locals.category;
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
