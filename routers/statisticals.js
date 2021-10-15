const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

const statController = require('../controllers/statistical.controller');




/* get users statistical */
router.get("/users", auth, statController.getUsersStat);






module.exports = router;