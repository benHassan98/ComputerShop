require("dotenv").config();
const Component = require("../models/component");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

exports.component_list = (req, res, next) => {
  Component.find({})
    .populate("category")
    .exec((err, docs) => {
      if (err) return next(err);
      res.json({ components: docs });
    });
};

exports.component_detail = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id))
    return next(createError(404, "Component not found"));
  Component.findById(req.params.id)
    .populate("category")
    .exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return next(createError(404, "Component not found"));

      res.json({ component: doc });
    });
};

exports.component_create = [
  upload.single("image"),
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name must be specified"),
  body("features")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("features must be specified"),
  body("manufacturer")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("manufacturer must be specified"),
  body("category")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("category must be specified"),
  body("price").trim().escape().isLength({ min: 1 }),
  body("stock").trim().escape().isLength({ min: 1 }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return next(createError(400, JSON.stringify(error.array())));

    const new_doc = new Component({
      name: req.body.name,
      features: req.body.features,
      manufacturer: req.body.manufacturer,
      category:ObjectId(req.body.category),
      price: req.body.price,
      stock: req.body.stock,
      image: {
        data: fs.readFileSync(
          path.resolve(__dirname, "..") +
            (req.file
              ? "/uploads/" + req.file.filename
              : "/images/unknown.avif")
        ),
        contentType: req.file ? req.file.mimetype : "image/avif",
      },
    });
    new_doc.save((err) => {
      if (err) return next(err);
      res.json({ component: new_doc, message: "Component Saved" });
    });
  },
];
exports.component_update = [
  upload.single("image"),
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name must be specified"),
  body("features")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("features must be specified"),
  body("manufacturer")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("manufacturer must be specified"),
  body("category")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("category must be specified"),
  body("price").trim().escape().isLength({ min: 1 }),
  body("stock").trim().escape().isLength({ min: 1 }),
  body("adminpassword").custom((value) => {
    if (value !== process.env.ADMINPASSWORD)
      throw new Error("Wrong admin password");

    return true;
  }),
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return next(createError(400, JSON.stringify(error.array())));

    let component;
    try {
      component = await Component.findById(req.params.id);
    } catch (err) {
      return next(err);
    }
    const new_doc = new Component({
      _id: req.params.id,
      name: req.body.name,
      features: req.body.features,
      manufacturer: req.body.manufacturer,
      category:ObjectId(req.body.category),
      price: req.body.price,
      stock: req.body.stock,
      image: req.file
        ? {
            data: fs.readFileSync(
              path.resolve(__dirname, "..") + "/uploads/" + req.file.filename
            ),
            contentType: req.file.mimetype,
          }
        : component.image,
    });

    Component.findByIdAndUpdate(req.params.id, new_doc, (err, saved_doc) => {
      if (err) return next(err);
      if (!saved_doc) return next(createError(404, "Component not found"));

      res.json({ component: saved_doc, message: "Component Updated" });
    });
  },
];

exports.component_delete = [
  body("adminpassword").custom((value) => {
    if (value !== process.env.ADMINPASSWORD)
      throw new Error("Wrong admin password");

    return true;
  }),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return next(createError(400, JSON.stringify(error.array())));
    Component.findByIdAndRemove(req.params.id, (err, doc) => {
      if (err) return next(err);
      if (!doc) return next(createError(404, "Component not found"));

      res.json({ component: doc, message: "Component Deleted" });
    });
  },
];
