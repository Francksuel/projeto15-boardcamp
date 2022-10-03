import joi from "joi";

const rentSchema = joi.object({
	customerId: joi.number().integer().min(1).required(),
	gameId: joi.number().integer().min(1).required(),
	daysRented: joi.number().integer().min(1).required(),
});

const rentValidationSchema = (req, res, next) => {
	const rent = req.body;
	const rentValidation = rentSchema.validate(rent);
	if (rentValidation.error) {
		return res.sendStatus(400);
	}

	res.locals.rent = {
		customerId: rent.customerId,
		gameId: rent.gameId,
		daysRented: rent.daysRented,
	};
	next();
};
export { rentValidationSchema };
