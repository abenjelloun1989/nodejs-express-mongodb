module.exports = app => {
    const meals = require("../controllers/meal.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Meal
    router.post("/", meals.create);
  
    // Retrieve all Meals
    router.get("/", meals.findAll);
  
    // Retrieve all published Meals
    router.get("/referenceMeals", meals.findAllReferenceMeals);
  
    // Retrieve a single Meal with id
    router.get("/:id", meals.findOne);
  
    // Update a Meal with id
    router.put("/:id", meals.update);
  
    // Delete a Meal with id
    router.delete("/:id", meals.delete);
  
    // Create a new Meal
    router.delete("/", meals.deleteAll);
  
    app.use('/api/meals', router);
  };