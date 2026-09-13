import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
    windowMs : 15*60*100, //15 minutes
    limit : 100, //100 requestrs per IP per window
    standardHeaders : true, // rate lmit in  response header
    legacyHeaders : false, 
    message : {
        success : false,
        message : "Too many requests, please try again later.",
    },
});

export const authLimiter = rateLimit({
    windowMs : 15*60*100,
    limit : 5,
    standardHeaders : true,
    legacyHeaders : false,
    message : {
        success : false,
        message : "Too many attempts, please try again in few minutes",
    },
});