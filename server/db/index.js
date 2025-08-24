import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'ld_model',
  port: 3306,
  password: '123456',
  waitForConnections: true,
  connectionLimit: 10,
})

await db.getConnection()

export default db
