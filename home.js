const express = require("express");
const nunjuncks = require("nunjucks");

const app = express();

nunjuncks.configure("views", {
  express: app,
  watch: true,
  autoescape: true
});

const midlewareVerifyQueryAge = (req, resp, next) => {
  if (req.query.age !== undefined && req.query.age !== null) {
    if (req.query.age >= 18 && req.url.includes("major")) {
      return next();
    } else {
      if (req.query.age < 18 && req.url.includes("minor")) {
        return next();
      } else {
        resp.redirect("/");
      }
    }
  } else {
    resp.redirect("/");
  }
};

app.set("view engine", "njk");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, resp) => {
  resp.render("register");
});

app.post("/check", (req, resp) => {
  if (req.body.age >= 18) {
    resp.redirect(`/major?age=${req.body.age}`);
  } else {
    resp.redirect(`/minor?age=${req.body.age}`);
  }
});

app.get("/major", midlewareVerifyQueryAge, (req, resp) => {
  resp.render("major", { age: req.query.age });
});

app.get("/minor", midlewareVerifyQueryAge, (req, resp) => {
  resp.render("minor", { age: req.query.age });
});

app.listen(3000);
