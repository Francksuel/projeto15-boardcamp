import express from "express";
import { addCustomer, getCustomer, getCustomers } from "../controllers/customers.controllers.js";
import { customerValidationSchema } from "../middlewares/customer.middleware.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers",customerValidationSchema, addCustomer);;

export { customersRouter };