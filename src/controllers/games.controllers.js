import { connection } from "../database/db.js";

const getGames = async (req, res) => {
	try {
		const games = await connection.query(
			`SELECT games.*, categories.name as "categoryName" 
            FROM games JOIN categories ON games."categoryId" = categories.id;`
		);
		res.send(games.rows);
	} catch {
		res.sendStatus(500);
	}
};

const addGame = async (req, res) => {
	const newGame = res.locals.game;
	try {		
		const categoryName = await connection.query(
			"SELECT name FROM categories WHERE id=$1;",
			[newGame.categoryId]
		);
		if (categoryName.rows.length === 0) {
			return res.sendStatus(400);
		}
		const games = await connection.query("SELECT * FROM games;");
		const isRepeatName = games.rows.filter(
			(element) => element.name === newGame.name
		);
		if (isRepeatName.length !== 0) {
			return res.sendStatus(409);
		}
		await connection.query(
			'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)',
			[
				newGame.name,
				newGame.image,
				newGame.stockTotal,
				newGame.categoryId,
				newGame.pricePerDay,
			]
		);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};

export { getGames, addGame };
