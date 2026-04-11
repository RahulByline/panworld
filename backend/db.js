const mysql = require("mysql2/promise");
const env = require("./env");

if (!env.JWT_ACCESS_SECRET || env.JWT_ACCESS_SECRET.length < 16) {
  console.warn("[env] JWT_ACCESS_SECRET should be at least 16 characters.");
}
if (!env.JWT_REFRESH_SECRET || env.JWT_REFRESH_SECRET.length < 16) {
  console.warn("[env] JWT_REFRESH_SECRET should be at least 16 characters.");
}

const pool = mysql.createPool(env.getDbConfig());

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("[db] Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "[db] MySQL access denied — check DB_USER and DB_PASSWORD in backend/.env (see .env.example).",
      );
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error(
        "[db] Database missing — create DB_NAME and import SQL (see backend/sql/README_SQL_IMPORT.md):",
        error.message,
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error("[db] Cannot reach MySQL — check DB_HOST and DB_PORT in backend/.env.");
    } else {
      console.error("[db] Database connection failed:", error.message);
    }
    return false;
  }
}

async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("[db] Error getting connection:", error.message);
    throw error;
  }
}

async function executeQuery(query, params = []) {
  const [rows] = await pool.execute(query, params);
  return rows;
}

async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const results = [];
    for (const { query, params = [] } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows);
    }
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testConnection,
  getConnection,
  executeQuery,
  executeTransaction,
};
