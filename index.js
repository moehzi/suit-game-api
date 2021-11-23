const { Router, request } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const routes = require("./routes/routes");
const { notFound, serverError } = require("./middlewares/error");
const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(expressLayouts);

app.use("/public", express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);
app.use(notFound);
app.use(serverError);
app.listen(PORT, () =>
  console.log(`app listening on port https://localhost:${PORT}`)
);
