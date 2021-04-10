module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        weight: String,
        ratio: String,
        insuline: String,
        published: Boolean
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