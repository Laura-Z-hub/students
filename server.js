const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gabim gjate marrjes se te dhenave nga databaza"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveri po punon ne porten ${PORT}`);
});