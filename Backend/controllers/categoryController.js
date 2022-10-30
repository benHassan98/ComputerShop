require("dotenv").config();
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const createError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
exports.category_detail = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return next(createError(404, "Category not found"));

  Category.findById(req.params.id, (err, doc) => {
    if (err) return next(err);
    if (!doc) return next(createError(404, "Category not found"));

    res.json({ category: doc });
  });
};

exports.category_list = (req, res, next) => {
  Category.find({}, (err, docs) => {
    if (err) return next(err);
    res.json({ categories: docs });
  });
};

exports.category_create = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name must be Specified"),
  body("description")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Description must be Specified"),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return next(createError(400, JSON.stringify(error.array())));

    let new_doc = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    new_doc.save((err) => {
      if (err) return next(err);
      res.json({ category: new_doc, message: "Category Saved" });
    });
  },
];

exports.category_update = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name must be Specified"),
  body("description")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Description must be Specified"),
  body("adminpassword").custom((value) => {
    if (value !== process.env.ADMINPASSWORD)
      throw new Error("Wrong admin password");

    return true;
  }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return next(createError(400, JSON.stringify(error.array())));

    let new_doc = new Category({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
    });
    Category.findByIdAndUpdate(req.params.id, new_doc, (err, saved_doc) => {
      if (err) return next(err);
      if (!saved_doc) return next(createError(404, "Category not found"));

      res.json({ category: saved_doc, message: "Category Updated" });
    });
  },
];

exports.category_delete = [
  body("adminpassword").custom((value) => {
    if (value !== process.env.ADMINPASSWORD)
      throw new Error("Wrong admin password");

    return true;
  }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return next(createError(400, JSON.stringify(error.array())));

    Category.findByIdAndRemove(req.params.id, (err, doc) => {
      if (err) return next(err);
      if (!doc) return next(createError(404, "Category not found"));

      res.json({ category: doc, message: "Category Deleted" });
    });
  },
];
