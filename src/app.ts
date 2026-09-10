import express, {Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/user/user.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import accountRoutes from "./modules/account/account.route.js";
import transactionRoutes from "./modules/transaction/transaction.route.js";
import invoiceRoutes from "./modules/invoice/invoice.route.js";

import dotenv from "dotenv";

dotenv.config();

const app : Application= express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/transactions", invoiceRoutes);

app.use(errorHandler);

export default app;