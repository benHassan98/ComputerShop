require("dotenv").config();
const Category = require("../models/category");
const categoryRouter = require("../routes/category");
const initializeMongoServer = require("../mongoConfigTesting");
const request = require("supertest");
const express = require("express");
const { before, describe } = require("mocha");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/category", categoryRouter);


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

process.env.ADMINPASSWORD = "123456";

describe("/category", () => {
  before(async () => {
    await initializeMongoServer();
    for (let i = 0; i < 3; i++) {
      await Category.create({
        name: `fake${i + 1}`,
        description: `brdo fake${i + 1}`,
      });
    }
  });
  it("should return all cateogries", (done) => {
    request(app)
      .get("/category/all")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (res.body.categories.length !== 3)
          throw new Error("length doesn't match");
      })
      .end(done);
  });

  it("should return the document with the provided id", (done) => {
    Category.create(
      {
        name: "fake",
        description: "brdo fake",
      },
      (err, doc) => {
        if (err) throw new Error("db Error");

        request(app)
          .get("/category/" + doc._id)
          .expect("Content-Type", /json/)
          .expect(200)
          .expect((res) => {
            if (res.body.category.name !== "fake")
              throw new Error("name doesn't match");
            if (res.body.category.description !== "brdo fake")
              throw new Error("description doesn't match");
          })
          .end(done);
      }
    );
  });

  it("should throw cateogry not found when fetching non existent category", (done) => {
    request(app)
      .get("/category/000000000000000000000000")
      .expect(404)
      .expect((res) => {
        if (res.body.message !== "Category not found")
          throw new Error("Category should not exist");
      })
      .end(done);
  });

  it("should create a new category", (done) => {
    request(app)
      .post("/category/create")
      .type("form")
      .send({
        name: "fake123",
        description: "brdo fake",
      })
      .then((res) => {
        let doc = res.body.category;
        request(app)
          .get("/category/" + doc._id)
          .expect(200)
          .expect((res) => {
            if (res.body.category.name !== doc.name)
              throw new Error("name doesn't match");
            if (res.body.category.description !== doc.description)
              throw new Error("description doesn't match");
          })
          .end(done);
      });
  });

  it("should update category with the provided id", (done) => {
    request(app)
      .get("/category/all")
      .then((res) => {
        let doc = res.body.categories[0];
        request(app)
          .post("/category/update/" + doc._id)
          .type("form")
          .send({
            name: "fake w bs",
            description: doc.description,
            adminpassword: "123456",
          })
          .then(() => {
            request(app)
              .get("/category/" + doc._id)
              .expect(200)
              .expect((res) => {
                if (res.body.category.name !== "fake w bs")
                  throw new Error("name didn't change");
              })
              .end(done);
          });
      });
  });

  it("should throw Category not found when updating a non existing category", (done) => {
    request(app)
      .post("/category/update/000000000000000000000000")
      .type("form")
      .send({
        name: "123",
        description: "456",
        adminpassword: "123456",
      })
      .then((res) => {
        if (res.body.message !== "Category not found")
          throw new Error("Category Shouldn't Exist");
        done();
      });
  });

  it("should delete Category with the provided id", (done) => {
    request(app)
      .get("/category/all")
      .then((res) => {
        let doc = res.body.categories[0];
        request(app)
          .post("/category/delete/" + doc._id)
          .type("form")
          .send({ adminpassword: "123456" })
          .then((res) => {
            if (res.body.message !== "Category Deleted")
              throw new Error("Category Shouldbe Deleted");
            done();
          });
      });
  });

  it("should throw Category not found when deleting a non existing category", (done) => {
    request(app)
      .post("/category/delete/000000000000000000000000")
      .type("form")
      .send({ adminpassword: "123456" })
      .then((res) => {
        if (res.body.message !== "Category not found")
          throw new Error("Category Shouldn't Exist");
        done();
      });
  });
});
