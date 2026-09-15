import { AppError } from "../utils/error.js";
import { verifyAccessToken } from "../utils/jwt.js";
export const isLoggedin = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        throw new AppError("Please login or register", 401);
    }
    ;
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
};
//# sourceMappingURL=auth.middleware.js.map