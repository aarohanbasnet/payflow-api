import { AppError } from "../utils/error.js";
export function errorHandler(err, req, res, next) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Internal server error';
    console.error(err);
    res.status(statusCode).json({
        success: false,
        message,
    });
}
//# sourceMappingURL=errorHandler.js.map