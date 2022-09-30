import { connection } from "../database/db.js";

function adicionaZero(numero) {
	if (numero <= 9) return "0" + numero;
	else return numero;
}

const getCustomers = async (req, res) => {
	const customers = await connection.query("SELECT * FROM customers;");
	customers.rows.forEach((element) => {
		let data = new Date(element.birthday);
		element.birthday =
			data.getFullYear() +
			"-" +
			adicionaZero(data.getMonth() + 1) +
			"-" +
			adicionaZero(data.getDate());
	});
	res.send(customers.rows);
};
const addCustomer = async (req, res) => {
	const customer = res.locals.customer;
	try {
		await connection.query(
			"INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4)",
			[customer.name, customer.phone, customer.cpf, customer.birthday]
		);
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
};
export { getCustomers, addCustomer };
