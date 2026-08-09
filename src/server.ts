import express, {Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "../src/modules/auth/auth.route.js";
import userRoutes from "../src/modules/user/user.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import accountRoutes from "../src/modules/account/account.route.js"
import transactionRoutes from "../src/modules/transaction/transaction.route.js"
import dotenv from "dotenv";

dotenv.config();

const app : Application= express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use(errorHandler);

export default app;