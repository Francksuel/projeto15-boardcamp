import joi from "joi";
import { stripHtml } from "string-strip-html";

const categorySchema = joi.object({
	name: joi.string().min(1).required(),
});

const categoryValidationSchema = (req, res, next) => {
	const category = req.body;
	const firstValidation = categorySchema.validate(category);
	if (!firstValidation.error) {
		category.name = stripHtml(category.name).result.trim();
	}
	const categoryValidation = categorySchema.validate(category);
	if (categoryValidation.error) {
		return res.sendStatus(400);
	}
	res.locals.category = category;
	next();
};
export { categoryValidationSchema };
