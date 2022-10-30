const mongoose = require("mongoose");

const { Schema } = mongoose;

CategorySchema = new Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model("Category", CategorySchema);
