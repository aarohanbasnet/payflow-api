import "dotenv/config";

const refreshTokenDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS);

const databaseUrl = process.env.NODE_ENV === "production" 
? process.env.PRODUCTION_DATABASE_URL : process.env.DATABASE_URL
export const env = {
    DATABASE_URL : databaseUrl,
    PORT : process.env.PORT!,
    ACCESS_TOKEN_SECRET_KEY : process.env.ACCESS_TOKEN_SECRET_KEY!,
    REFRESH_TOKEN_SECRET_KEY : process.env.REFRESH_TOKEN_SECRET_KEY!,
    REFRESH_TOKEN_TTL_MS : refreshTokenDays*24*60*60*1000!,
    RESEND_API_KEY : process.env.RESEND_API_KEY!,
    MAIL_FROM : process.env.MAIL_FROM!,
}