const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


// Krijon databazën dhe fut studentët
app.get("/setup-db", async (req, res) => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        course VARCHAR(100)
      )
    `);

    const count = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    if (count.rows[0].count == 0) {

      await pool.query(`
        INSERT INTO students(name,age,course)
        VALUES
        ('Ardi',16,'Informatike'),
        ('Elira',17,'Programim'),
        ('Noel',15,'Web Development')
      `);

    }

    res.send("Databaza u krijua me sukses ✅");

  } catch(error){

    console.log(error);

    res.status(500).send(error.message);
  }
});


// GET nga databaza
app.get("/api/students", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM students ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch(error){

    console.log(error);

    res.status(500).json({
      message:"Gabim gjate marrjes se te dhenave",
      error:error.message
    });

  }

});


// GET nje student sipas ID
app.get("/api/students/:id", async(req,res)=>{

  try{

    const result = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [req.params.id]
    );

    res.json(result.rows[0]);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});


app.listen(PORT,()=>{

   console.log(`Serveri po punon ne porten ${PORT}`);

});