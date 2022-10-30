require("dotenv").config();
const Category = require("../models/category");
const Component = require("../models/component");
const categoryRouter = require("../routes/category");
const componentRouter = require("../routes/component");
const initializeMongoServer = require("../mongoConfigTesting");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { before, describe } = require("mocha");
const fs = require("fs");
const path = require("path");
const app = express();
//000000000000000000000000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/category", categoryRouter);
app.use("/component", componentRouter);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

process.env.ADMINPASSWORD = "123456";

describe("/component", () => {
  const categories = [];
  before(async () => {
    await initializeMongoServer();
    const pics = ["bird", "bunny", "cat", "dog"];
    for (let i = 0; i < 3; i++) {
      let category_doc = new Category({
        name: `fake${i + 1}`,
        description: `brdo fake${i + 1}`,
      });
      await category_doc.save();
      categories.push(category_doc);
      let component_doc = new Component({
        name: `fake component ${i + 1}`,
        features: `fake component feature ${i + 1}`,
        manufacturer: `fake component manu ${i + 1}`,
        category: category_doc._id,
        price: i + 10,
        stock: i + 2,
        image: {
          data: fs.readFileSync(
            path.join(__dirname + "/images/" + pics[i] + ".jpeg")
          ),
          contentType: "image/jpeg",
        },
      });
      await component_doc.save();
    }
  });

  it("should return all components", (done) => {
    request(app)
      .get("/component/all")
      .expect(200)
      .expect((res) => {
        if (res.body.components.length !== 3)
          throw new Error("Components not saved");
      })
      .end(done);
  });

  it("should return the document with the provided id", (done) => {
    request(app)
      .get("/component/all")
      .then((res) => {
        const doc = res.body.components[0];
        request(app)
          .get("/component/" + doc._id)
          .expect(200)
          .expect((res) => {
            let image_flag = 1;
            res.body.component.image.data.data.forEach((pixel, i) => {
              image_flag &= pixel === doc.image.data.data[i];
            });
            if (res.body.component.name !== doc.name)
              throw new Error("name doesn't match");
            if (res.body.component.description !== doc.description)
              throw new Error("desc doesn't match");
            if (res.body.component.manufacturer !== doc.manufacturer)
              throw new Error("manu dosen't match");
            if (res.body.component.price !== doc.price)
              throw new Error("price dosen't match");
            if (res.body.component.stock !== doc.stock)
              throw new Error("stock dosen't match");
            if (!image_flag) throw new Error("image dosen't match");
          })
          .end(done);
      });
  });

  it("should throw component not found when fetching non existent component", (done) => {
    request(app)
      .get("/component/000000000000000000000000")
      .expect(404)
      .expect((res) => {
        if (res.body.message !== "Component not found")
          throw new Error("Component shouldn't exist");
      })
      .end(done);
  });

  it(" should create a new component", (done) => {
    request(app)
      .post("/component/create")
      .set("content-type", "multipart/form-data")
      .field("name", "fake")
      .field("category", categories[0].id)
      .field("features", "features,123")
      .field("manufacturer", "manufacturer")
      .field("price", "10")
      .field("stock", "2")
      .attach(
        "image",
        fs.readFileSync(`${__dirname}/images/dog.jpeg`),
        "test/images/dog.jpeg"
      )
      .then((res) => {
        if (res.body.message !== "Component Saved")
          throw new Error("Component Should be Saved");
        done();
      })
      .catch((err) => done(err));
  });
  it("should throw error when creating with missing fields", (done) => {
    request(app)
      .post("/component/create")
      .set("content-type", "multipart/form-data")
      .field("category", "fake1")
      .field("features", "feature,abc")
      .field("manufacturer", "manufacturer")
      .field("price", "10")
      .field("stock", "2")
      .attach(
        "image",
        fs.readFileSync(`${__dirname}/images/dog.jpeg`),
        "test/images/dog.jpeg"
      )
      .then((res) => {
        if (JSON.parse(res.body.message)[0].msg !== "Name must be specified")
          throw new Error("Name Should be Missing");
        done();
      })
      .catch((err) => done(err));
  });

  it("should update component with provided id", (done) => {
    request(app)
      .get("/component/all")
      .then((res) => {
        const doc = res.body.components[0];
        const doc2 = res.body.components[1];
        request(app)
          .post("/component/update/" + doc._id)
          .set("content-type", "multipart/form-data")
          .field("name", "fakes")
          .field("category", doc2.category._id)
          .field("features", "feature0000")
          .field("manufacturer", "manuf855acturer")
          .field("price", "100")
          .field("stock", "22")
          .field("adminpassword", "123456")
          .attach(
            "image",
            fs.readFileSync(`${__dirname}/images/dog.jpeg`),
            "test/images/dog.jpeg"
          )
          .then((res) => {

            if (res.body.message !== "Component Updated")
              throw new Error("Component should be updated");
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it("should delete component with the provided id", (done) => {
    request(app)
      .get("/component/all")
      .then((res) => {
        const doc = res.body.components[0];
        request(app)
          .post("/component/delete/" + doc._id)
          .type("form")
          .send({ adminpassword: "123456" })
          .then((res) => {
            if (res.body.message !== "Component Deleted")
              throw new Error("Component Should be Deleted");
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it("should throw Component not found when deleting component with wrong id", (done) => {
    request(app)
      .post("/component/delete/000000000000000000000000")
      .type("form")
      .send({ adminpassword: "123456" })
      .then((res) => {
        if (res.body.message !== "Component not found")
          throw new Error("Component Shouldn't Exist");
        done();
      })
      .catch((err) => done(err));
  });
});
