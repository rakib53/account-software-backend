const {
  registration,
  loginUser,
  verifyJsonWebToken,
  userInfo,
  logoutUser,
} = require("../controller/users.controller");
const router = require("express").Router();

router.post("/registration", registration);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/userInfo", verifyJsonWebToken, userInfo);
module.exports = router;
