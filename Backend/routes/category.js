const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");

router.get("/all", CategoryController.category_list);

router.post("/create", CategoryController.category_create);

router.post("/update/:id", CategoryController.category_update);

router.post("/delete/:id", CategoryController.category_delete);

router.get("/:id", CategoryController.category_detail);

module.exports = router;
