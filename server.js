const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://192.168.1.24:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// db
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// clean db
const Meal = db.meals;
Meal.collection.drop();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to abenjelloun application." });
});

// routes
require("./app/routes/meal.routes")(app);

// load csv
const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./app/resources/ciqual_20200707.csv', {encoding: 'utf-8'})
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    
    // Create a Meal
    const meal = new Meal({
      code: row.alim_code,
      title: row.alim_nom_fr,
      carbo: row.carbo,
      isReference: true
    });

    // Save Meal in the database
    meal
      .save(meal)
      .catch(err => {
        console.log("Some error occurred while creating the Meal.");
      });
  })
  .on('end', () => {
    console.log('Csv file successfully processed!');
  });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});