const bcrypt = require("bcrypt");
const { User, Biodata, UserRoom } = require("../models");
const jwt = require("jsonwebtoken");
const {
  JWT_SIGNATURE_KEY = "$2b$10$o/Um9jZOMZxohkDcSpmd7.2DPVB1GLYOo04rQdC3tc81WT2jzYTem",
} = process.env;

function isPasswordValid(password, encryptedPassword) {
  return bcrypt.compareSync(password, encryptedPassword);
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SIGNATURE_KEY, {
    expiresIn: "1h",
  });
}
exports.register = async (req, res) => {
  const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

  const usernameExist = await User.findOne({
    where: { username: req.body.username },
  });

  if (usernameExist) {
    return res.status(400).json({
      data: {
        status: "FAIL",
        message: "Username is already exist!",
      },
    });
  }

  const user = await User.create({
    username: req.body.username,
    encryptedPassword,
    role: req.body.role,
  });

  const biodata = await Biodata.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    userId: user.id,
  });

  return res.status(201).json({
    status: "OK",
    message: "You are sucessfully registered",
    data: {
      id: user.id,
      username: user.username,
      role: user.role,
      biodata,
    },
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({
      status: "FAIL",
      data: {
        name: "UNAUTHORIZED",
        message: "Username does not exist",
      },
    });
  }

  if (!isPasswordValid(password, user.encryptedPassword)) {
    return res.status(401).json({
      status: "FAIL",
      data: {
        name: "UNAUTHORIZED",
        message: "Wrong password",
      },
    });
  }
  return res.status(201).json({
    status: "OK",
    data: {
      token: createToken({
        id: user.id,
        username: user.name,
        role: user.role,
      }),
    },
  });
};
