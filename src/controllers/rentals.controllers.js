import { connection } from "../database/db.js";

const getRentals = async (req, res) => {
	const customerId = req.query.customerId;
	const gameId = req.query.gameId;
	try {
		let rentals = {};
		if (customerId) {
			rentals = (
				await connection.query(
					`SELECT rentals.*,json_build_object('id',customers.id,'name',customers.name) AS customer,
				json_build_object( 'id', games.id,'name', games.name ,'categoryId', games."categoryId",
				'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id 
				JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id
				WHERE "customerId" = $1;`,
					[customerId]
				)
			).rows;
		} else if (gameId) {
			rentals = (
				await connection.query(
					`SELECT rentals.*,json_build_object('id',customers.id,'name',customers.name) AS customer,
				json_build_object( 'id', games.id,'name', games.name ,'categoryId', games."categoryId",
				'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id 
				JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id
				WHERE "gameId" = $1;`,
					[gameId]
				)
			).rows;
		} else {
			rentals = (
				await connection.query(
					`SELECT rentals.*,json_build_object('id',customers.id,'name',customers.name) AS customer,
				json_build_object( 'id', games.id,'name', games.name ,'categoryId', games."categoryId",
				'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id 
				JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
				)
			).rows;
		}
		rentals.forEach((element) => {
			element.rentDate = element.rentDate.toISOString().substring(0, 10);
			if (!(element.returnDate === null)) {
				element.returnDate = element.returnDate.toISOString().substring(0, 10);
			}
		});
		res.send(rentals);
	} catch {
		res.sendStatus(500);
	}
};

const insertRent = async (req, res) => {
	const rent = res.locals.rent;
	try {
		const customer = await connection.query(
			`SELECT * FROM customers WHERE customers.id = $1;`,
			[rent.customerId]
		);
		const game = await connection.query(
			`SELECT * FROM games WHERE games.id = $1;`,
			[rent.gameId]
		);
		if (customer.rows.length === 0 || game.rows.length === 0) {
			return res.sendStatus(400);
		}
		const rentalsGame = await connection.query(
			`SELECT * FROM rentals WHERE rentals."gameId" = $1;`,
			[rent.gameId]
		);
		if (rentalsGame.rows.length >= game.rows[0].stockTotal) {
			return res.sendStatus(400);
		}
		rent["returnDate"] = null;
		rent["delayFee"] = null;
		rent["rentDate"] = new Date(Date.now());
		rent["originalPrice"] = rent.daysRented * game.rows[0].pricePerDay;

		await connection.query(
			`INSERT INTO rentals ("customerId", "gameId","rentDate", "daysRented","returnDate" ,"originalPrice","delayFee" ) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
			[
				rent.customerId,
				rent.gameId,
				rent.rentDate,
				rent.daysRented,
				rent.returnDate,
				rent.originalPrice,
				rent.delayFee,
			]
		);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};

const finishRent = async (req, res) => {
	const id = req.params.id;
	try {
		const rent = (
			await connection.query(
				`SELECT * FROM rentals JOIN games ON rentals."gameId"=games.id WHERE rentals.id = $1;`,
				[id]
			)
		).rows;
		if (rent.length === 0) {
			return res.sendStatus(404);
		}
		if (rent[0].returnDate !== null) {
			return res.sendStatus(400);
		}
		rent[0].returnDate = new Date(Date.now());
		const diff =
			Math.floor((rent[0].returnDate - rent[0].rentDate) / 86400000) -
			rent[0].daysRented;
		if (diff <= 0) {
			rent[0].delayFee = 0;
		} else {
			rent[0].delayFee = rent[0].pricePerDay * diff;
		}
		await connection.query(
			`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2  WHERE rentals.id = $3`,
			[rent[0].returnDate, rent[0].delayFee, id]
		);
		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
};

const deleteRent = async (req, res) => {
	const id = req.params.id;
	try {
		const rent = (
			await connection.query(
				`SELECT * FROM rentals JOIN games ON rentals."gameId"=games.id WHERE rentals.id = $1;`,
				[id]
			)
		).rows;
		if (rent.length === 0) {
			return res.sendStatus(404);
		}
		if (rent[0].returnDate === null) {
			return res.sendStatus(400);
		}

		await connection.query(`DELETE FROM rentals WHERE rentals.id = $1`, [id]);
		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
};

export { insertRent, getRentals, finishRent, deleteRent };
