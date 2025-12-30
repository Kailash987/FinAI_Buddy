import { Pool } from "pg";

// Check if DATABASE_URL is for Supabase (contains supabase.co)
const isSupabase = process.env.DATABASE_URL?.includes("supabase.co");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase
    ? {
        rejectUnauthorized: false,
      }
    : false,
  max: 10, // Maximum number of clients in the pool (reduced to avoid connection issues)
  idleTimeoutMillis: 20000, // Close idle clients after 20 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  statement_timeout: 30000, // Statement timeout in milliseconds
  query_timeout: 30000, // Query timeout in milliseconds
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors (don't crash the app on connection errors)
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't throw - let individual queries handle their own errors
});

// Test connection on startup (non-blocking, don't fail if it times out)
if (process.env.NODE_ENV !== "test") {
  pool
    .query("SELECT NOW()")
    .then(() => {
      console.log("✓ Database connection established");
    })
    .catch((err) => {
      console.warn("⚠ Database connection test failed (this is OK, connections will be established on demand):", err.message);
    });
}
