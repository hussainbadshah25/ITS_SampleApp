const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { authenticateToken, adminMiddleware } = require("../Middlewares/auth");

router.post(
  "/addUser",
  [authenticateToken, adminMiddleware],
  userController.addUser
);

router.get(
  "/AllUsers",
  [authenticateToken, adminMiddleware],
  userController.getUsersProfiles
);
router.get(
  "/ProfileDetails/:userId",
  [authenticateToken],
  userController.getUserProfileById
);

router.put("/updatePD", [authenticateToken], userController.updateUserProfile);

router.delete(
  "/deleteUser",
  [authenticateToken, adminMiddleware],
  userController.deleteUser
);

module.exports = router;
