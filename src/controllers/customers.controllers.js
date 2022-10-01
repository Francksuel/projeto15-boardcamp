import { connection } from "../database/db.js";

const getCustomers = async (req, res) => {
	const cpf = req.query.cpf;
	try {
		let customers = {};
		if (cpf) {
			customers = await connection.query(
				`SELECT * FROM customers WHERE customers.cpf LIKE $1;`,
				[`${cpf}%`]
			);
		} else {
			customers = await connection.query("SELECT * FROM customers;");
		}
		customers.rows.forEach((element) => {
			element.birthday = element.birthday.toISOString().substring(0, 10);
		});
		res.send(customers.rows);
	} catch {
		res.sendStatus(500);
	}
};

const getCustomer = async (req, res) => {
	const id = req.params.id;
	try {
		const customer = await connection.query(
			`SELECT * FROM customers WHERE customers.id = $1;`,
			[id]
		);
		if (customer.rows.length === 0) {
			return res.sendStatus(404);
		}
		customer.rows[0].birthday = customer.rows[0].birthday
			.toISOString()
			.substring(0, 10);
		res.send(customer.rows[0]);
	} catch {
		res.sendStatus(500);
	}
};

const addCustomer = async (req, res) => {
	const customer = res.locals.customer;
	try {
		const customers = await connection.query("SELECT * FROM customers;");
		const isRepeatCpf = customers.rows.filter(
			(element) => element.cpf === customer.cpf
		);
		if (isRepeatCpf.length !== 0) {
			return res.sendStatus(409);
		}
		await connection.query(
			"INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4)",
			[customer.name, customer.phone, customer.cpf, customer.birthday]
		);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};

const editCustomer = async (req, res) => {
	const customer = res.locals.customer;
	const id = req.params.id;
	try {
		const customerEdited = await connection.query(
			`SELECT * FROM customers WHERE customers.id = $1;`,
			[id]
		);
		if (customerEdited.rows.length === 0) {
			return res.sendStatus(404);
		}
		const customers = await connection.query("SELECT * FROM customers;");
		const isRepeatCpf = customers.rows.filter(
			(element) => element.cpf === customer.cpf
		);
		if (isRepeatCpf.length > 0) {
			if (isRepeatCpf.length > 1) {
				return res.sendStatus(409);
			}
			if (isRepeatCpf[0].id !== Number(id)) {
				return res.sendStatus(409);
			}
		}
		await connection.query(
			"UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;",
			[customer.name, customer.phone, customer.cpf, customer.birthday, id]
		);
		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
};

export { getCustomers, addCustomer, getCustomer, editCustomer };
