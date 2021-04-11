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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to abenjelloun application." });
});

// routes
require("./app/routes/meal.routes")(app);

// load csv
const csv = require('csv-parser');
const fs = require('fs');
const Meal = db.meals;

fs.createReadStream('./app/resources/ciqual_20200707.csv', {encoding: 'utf-8'})
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    console.log(row);
    // Create a Meal
    const meal = new Meal({
      code: row.alim_code,
      title: row.alim_nom_fr,
      carbo: row.carbo, //typeof carbo == "number" ? Number.parseFloat(carbo) : 0,
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
    console.log('CSV file successfully processed');
  });

// init db meals
/*
const Meal = db.meals;
var referenceMeals = require("./app/resources/reference-meals.json");
for(var i in referenceMeals) {
  var referenceMeal = referenceMeals[i];
  /*var carbo = typeof referenceMeal.carbo == "string" && referenceMeal.carbo.indexOf('$') > -1
              ? referenceMeal.carbo.replace(',', '.')
              : referenceMeal.carbo;
  // Create a Meal
  const meal = new Meal({
    code: referenceMeal.alim_code,
    title: referenceMeal.alim_nom_fr,
    carbo: referenceMeal.carbo, //typeof carbo == "number" ? Number.parseFloat(carbo) : 0,
    isReference: true
  });
  // Save Meal in the database
  meal
    .save(meal)
    .catch(err => {
      console.log("Some error occurred while creating the Meal.");
    });
}
*/

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});