import joi from "joi";

const rentalSchema = joi.object({	
	customerId: joi.number().integer().min(1).required(),
	gameId: joi.number().integer().min(1).required(),
	daysRented: joi.number().integer().min(1).required(),
});

const rentalValidationSchema = (req, res, next) => {
	const rental = req.body;	
	const rentalValidation = rentalSchema.validate(rental);
	if (rentalValidation.error) {
		return res.sendStatus(400);
	}
	res.locals.rental = rental;
	next();
};
export { rentalValidationSchema };