import joi from "joi";
import { stripHtml } from "string-strip-html";

const gameSchema = joi.object({
	name: joi.string().min(1).required(),
	image: joi.string().uri().required(),
	stockTotal: joi.number().integer().min(1).required(),
	categoryId: joi.number().integer().min(1).required(),
	pricePerDay: joi.number().integer().min(1).required(),
});

const gameValidationSchema = (req, res, next) => {
	const game = req.body;
	const firstValidation = gameSchema.validate(game);
	if (!firstValidation.error) {
		game.name = stripHtml(game.name).result.trim();
	}
	const gameValidation = gameSchema.validate(game);
	if (gameValidation.error) {
		return res.sendStatus(400);
	}
	res.locals.game = game;
	next();
};
export { gameValidationSchema };
