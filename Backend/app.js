require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const componentRouter = require("./routes/component");
const categoryRouter = require("./routes/category");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({
  origin:process.env.REACT_APP_URL
}));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/component", componentRouter);
app.use("/category", categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
