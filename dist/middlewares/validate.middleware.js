import { AppError } from "../utils/error.js";
export const validate = (schema, target) => (req, res, next) => {
    const data = req[target];
    const result = schema.safeParse(data);
    if (!result.success) {
        const message = result.error.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join(",");
        return next(new AppError(message, 400));
    }
    req[target] = result.data;
    next();
};
//# sourceMappingURL=validate.middleware.js.map