const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

function handleDisconnect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      if (
        err.code === "PROTOCOL_CONNECTION_LOST" ||
        err.code === "ECONNRESET" ||
        err.code === "ECONNREFUSED"
      ) {
        console.log("Attempting to reconnect...");
        setTimeout(handleDisconnect, 3000); // Try to reconnect after 3 seconds
      } else {
        throw err;
      }
    } else {
      console.log("Connected to database.");
      connection.release();
    }
  });
}

// Initial connection
handleDisconnect();

// Ping database periodically to keep connection alive
setInterval(() => {
  pool.query("SELECT 1", (err) => {
    if (err) {
      console.error("Ping error:", err);
      handleDisconnect();
    }
  });
}, 60000); // Ping every 60 seconds

// Promisify for Node.js async/await use
const promisePool = pool.promise();

module.exports = {
  query: (sql, values) => promisePool.query(sql, values),
  getConnection: () => promisePool.getConnection(),
  end: () => promisePool.end(),
};

// Graceful shutdown
process.on("SIGINT", () => {
  pool.end((err) => {
    if (err) {
      console.error("Error closing MySQL pool:", err);
    } else {
      console.log("MySQL pool closed.");
    }
    process.exit(0);
  });
});
