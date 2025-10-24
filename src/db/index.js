import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

let _db; // кэш drizzle-инстанс

/**  единый экземпляр drizzle */
export function getDb() {
  if (_db) return _db;

  // пул (один раз за жизнь процесса)
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  _db = drizzle(pool, { schema, mode: "default" });
  return _db;
}

// const connection = await mysql.createConnection({
//   uri: process.env.DATABASE_URL,
// });

// export const db = drizzle(connection, { schema, mode: "default" });
