const express = require("express");
const { loginController, registrationController, getUserDataController } = require("../controllers/user.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/login", loginController);
router.post("/create",registrationController)
router.get("/",authMiddleware,getUserDataController)

module.exports = router;
