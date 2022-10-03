import joi from "joi";
import { stripHtml } from "string-strip-html";

const customerSchema = joi.object({
	name: joi.string().min(1).required(),
	phone: joi.string().min(10).max(11).pattern(/^\d+$/).required(),
	cpf: joi.string().length(11).pattern(/^\d+$/).required(),
	birthday: joi.string().isoDate().required(),
});

const customerValidationSchema = (req, res, next) => {
	const customer = req.body;
	const firstValidation = customerSchema.validate(customer);
	if (!firstValidation.error) {
		customer.name = stripHtml(customer.name).result.trim();
	}
	const customerValidation = customerSchema.validate(customer);
	if (customerValidation.error) {
		return res.sendStatus(400);
	}
	res.locals.customer = customer;
	next();
};
export { customerValidationSchema };
