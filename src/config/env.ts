import "dotenv/config";

const refreshTokenDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS);

export const env = {
    DATABASE_URL : process.env.DATABASE_URL!,
    PORT : process.env.PORT!,
    ACCESS_TOKEN_SECRET_KEY : process.env.ACCESS_TOKEN_SECRET_KEY!,
    REFRESH_TOKEN_SECRET_KEY : process.env.REFRESH_TOKEN_SECRET_KEY!,
    REFRESH_TOKEN_TTL_MS : refreshTokenDays*24*60*60*1000!,
    RESEND_API_KEY : process.env.RESEND_API_KEY!,
}