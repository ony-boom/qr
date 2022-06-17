import mysql from 'mysql2';

const dbOption: mysql.PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.NODE_ENV === "development" ? 3306 : Number(process.env.DB_PORT)
}

export const pool = mysql.createPool(dbOption);

// promised pool
const promisePool = pool.promise();
export default promisePool;
