const mongoose = require("mongoose");

const { Schema } = mongoose;

const ComponentSchema = new Schema({
  name: String,
  features: String,
  manufacturer: String,
  category: { type: Schema.ObjectId, ref: "Category" },
  price: Number,
  stock: Number,
  image: { data: Buffer, contentType: String },
});

module.exports = mongoose.model("Component", ComponentSchema);
