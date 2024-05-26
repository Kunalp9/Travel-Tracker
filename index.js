import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'yourDB',
  password: 'yourPassword',
  port: 5432,
})

db.connect();

app.get("/", async (req, res) => {
  //Write your code here.
  const data = await db.query('SELECT country_code FROM visited_countries');
  let countries = [];
  data.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  res.render('index.ejs', {
    countries: countries,
    total: countries.length
  });
  
});

app.post('/add', async (req, res)=>{
  let input = req.body.country;
  let inputData = await db.query(`SELECT country_code FROM countries WHERE country_name = '${input}' `);
  const countryCode = inputData.rows[0].country_code;
  db.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [countryCode]);
  res.redirect('/');
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
