const express = require("express");
const { loginController, registrationController } = require("../controllers/user.controller");
const router = express.Router();

router.post("/login", loginController);
router.post("/create",registrationController)

module.exports = router;
