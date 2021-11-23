const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const isRole = require("../middlewares/isRole");
const apiControllers = require("../controllers/apiControllers");
// API

router.get(
  "/api/v1/users",
  auth,
  isRole(["SuperAdmin"]),
  apiControllers.getUser
);

router.get(
  "/api/v1/profile",
  auth,
  isRole(["SuperAdmin", "PlayerUser"]),
  apiControllers.showProfile
);

router.get(
  "/api/v1/game-history",
  auth,
  isRole(["PlayerUser"]),
  apiControllers.gameHistory
);

router.post(
  "/api/v1/create-room",
  auth,
  isRole(["PlayerUser"]),
  apiControllers.createRoom
);

router.post(
  "/api/v1/join-fight/:id",
  auth,
  isRole(["PlayerUser"]),
  apiControllers.fight
);

router.post(
  "/api/v1/join-room/:id",
  auth,
  isRole(["PlayerUser"]),
  apiControllers.join
);

router.post("/api/v1/login", authController.login);
router.post("/api/v1/register", authController.register);

// Check Error 500
router.get("/error", (req, res) => {
  throw new Error("Something went wrong");
});
module.exports = router;
