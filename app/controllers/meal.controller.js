const db = require("../models");
const Meal = db.meals;

// Create and Save a new Meal
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Meal
  const meal = new Meal({
    title: req.body.title,
    carbo: req.body.carbo,
    isReference: false
  });

  // Save Meal in the database
  meal
    .save(meal)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Meal."
      });
    });
};

// Retrieve all Meals from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Meal.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving meals."
      });
    });
};

// Find a single Meal with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Meal.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Meal with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Meal with id=" + id });
      });  
};

// Update a Meal by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Meal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Meal with id=${id}. Maybe Meal was not found!`
          });
        } else res.send({ message: "Meal was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Meal with id=" + id
        });
      });
  };

// Delete a Meal with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Meal.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Meal with id=${id}. Maybe Meal was not found!`
          });
        } else {
          res.send({
            message: "Meal was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Meal with id=" + id
        });
      });
  };

// Delete all Meals from the database.
exports.deleteAll = (req, res) => {
    Meal.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Meals were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all meals."
        });
      });
  };

// Find all published Meals
exports.findAllReferenceMeals = (req, res) => {
    Meal.find({ isReference: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving meals."
        });
      });
  };