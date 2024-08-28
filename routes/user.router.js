const {
  registration,
  loginUser,
  verifyJsonWebToken,
  userInfo,
} = require("../controller/users.controller");
const router = require("express").Router();

router.post("/registration", registration);
router.post("/login", loginUser);
router.get("/userInfo", verifyJsonWebToken, userInfo);
module.exports = router;
