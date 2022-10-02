import { connection } from "../database/db.js";

const getRentals = async (req, res) => {
	const cpf = req.query.cpf;
	try {
		let rentals = {};
		if (cpf) {
			rentals = await connection.query(
				`SELECT * FROM rentals WHERE rentals.cpf LIKE $1;`,
				[`${cpf}%`]
			);
		} else {
			rentals = await connection.query("SELECT * FROM rentals;");
		}		
		res.send(rentals.rows);
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
        console.log(game.rows[0].stockTotal)
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
export { insertRental,getRentals };
