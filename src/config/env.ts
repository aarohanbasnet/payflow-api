import "dotenv/config";

export const env = {
    DATABASE_URL : process.env.DATABASE_URL!,
    PORT : process.env.PORT!,
    ACCESS_TOKEN_SECRET_KEY : process.env.ACCESS_TOKEN_SECRET_KEY!,
    REFRESH_TOKEN_SECRET_KEY : process.env.REFRESH_TOKEN_SECRET_KEY!,
}