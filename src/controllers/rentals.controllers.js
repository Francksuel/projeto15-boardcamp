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
		} else if (gameId){
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
		}else{
			rentals = (
				await connection.query(
					`SELECT rentals.*,json_build_object('id',customers.id,'name',customers.name) AS customer,
				json_build_object( 'id', games.id,'name', games.name ,'categoryId', games."categoryId",
				'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id 
				JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
				)
			).rows;
		}

		res.send(rentals);
	} catch {
		res.sendStatus(500);
	}
};

const insertRental = async (req, res) => {
	const rental = res.locals.rental;
	try {
		const customer = await connection.query(
			`SELECT * FROM customers WHERE customers.id = $1;`,
			[rental.customerId]
		);
		const game = await connection.query(
			`SELECT * FROM games WHERE games.id = $1;`,
			[rental.gameId]
		);
		if (customer.rows.length === 0 || game.rows.length === 0) {
			return res.sendStatus(400);
		}
		const rentalsGame = await connection.query(
			`SELECT * FROM rentals WHERE rentals."gameId" = $1;`,
			[rental.gameId]
		);
		if (rentalsGame.rows.length >= game.rows[0].stockTotal) {
			return res.sendStatus(400);
		}
		rental["returnDate"] = null;
		rental["delayFee"] = null;
		rental["rentDate"] = new Date(Date.now());
		rental["originalPrice"] = rental.daysRented * game.rows[0].pricePerDay;

		await connection.query(
			`INSERT INTO rentals ("customerId", "gameId","rentDate", "daysRented","returnDate" ,"originalPrice","delayFee" ) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
			[
				rental.customerId,
				rental.gameId,
				rental.rentDate,
				rental.daysRented,
				rental.returnDate,
				rental.originalPrice,
				rental.delayFee,
			]
		);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};
export { insertRental, getRentals };
