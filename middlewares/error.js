const { error } = require("./resBuilder");
const notFound = (req, res) => {
  return res.status(404).render("404", {
    status: "FAIL",
    title: "404 - Not Found",
    url: req.url,
    layout: false,
  });
};
const serverError = (err, req, res, next) => {
  res.status(500).render("500", {
    title: "500: Internal Server Error",
    layout: false,
    error: error(err),
  });
};

module.exports = { notFound, serverError };
