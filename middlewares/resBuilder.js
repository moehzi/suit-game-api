const success = (data = null) => ({
  status: "OK",
  data,
});

const fail = (msg) => ({
  status: "FAIL",
  message: msg,
});

const error = (err) => ({
  status: "ERROR",
  data: {
    name: err.name,
    message: err.message,
    stack: err.stack,
  },
});

module.exports = {
  success,
  fail,
  error,
};
