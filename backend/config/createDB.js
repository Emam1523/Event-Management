const { Client } = require("pg");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
  override: true,
});

const connectionString = process.env.DATABASE_URL.replace(
  "/Event_Management",
  "/postgres",
);
console.log(
  "Connecting to database server using connection string:",
  connectionString.replace(/:[^:@]+@/, ":****@"),
);

const client = new Client({ connectionString });

async function run() {
  await client.connect();
  try {
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='Event_Management'`,
    );
    if (res.rowCount === 0) {
      console.log("Database 'Event_Management' does not exist. Creating...");
      await client.query(`CREATE DATABASE "Event_Management"`);
      console.log("Database 'Event_Management' created successfully.");
    } else {
      console.log("Database 'Event_Management' already exists.");
    }
  } catch (err) {
    console.error("Error checking/creating database:", err);
  } finally {
    await client.end();
  }
}

run();
