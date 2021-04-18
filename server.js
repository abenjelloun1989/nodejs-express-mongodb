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
LoadStaticData();

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function LoadStaticData() {
  const csv = require('csv-parser');
  const fs = require('fs');
  const download = require('image-downloader');
  const imagesPath = '../common/images/';
  const resourcesPath = '../common/resources/';
    
  // clean db
  const Meal = db.meals;
  Meal.collection.drop();

  fs.createReadStream(resourcesPath.concat('ciqual_20200707.csv'), { encoding: 'utf-8' })
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {

      // Create a Meal
      const meal = new Meal({
        code: row.code,
        title: row.alim_nom_fr,
        carbo: row.alim_carbo,
        url: row.alim_image_url,
        isReference: true
      });

      if (meal && meal.url && !fs.existsSync(imagesPath.concat(meal.code).concat(".jpg"))) {
        // cache images on disk
        const options = {
          url: meal.url,
          dest: imagesPath.concat(meal.code).concat(".jpg")
        };

        download.image(options)
          .then(({ filename }) => {
            // success action
            console.log(meal.code.concat(" downloaded image"))
          })
          .catch((err) => {
            console.error(err);
            console.log('ERROR while downloading image : '.concat(meal.code));
          });
      }
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
}
