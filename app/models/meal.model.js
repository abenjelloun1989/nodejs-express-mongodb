module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        code: String,
        title: String,
        carbo: String,
        isReference: Boolean
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Meal = mongoose.model("meal", schema);
    return Meal;
  };