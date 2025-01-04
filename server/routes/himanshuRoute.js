const express = require("express");
const { getPublicSmartContractInfo } = require("../controllers/himanshuController");

const router = express.Router();

router.route("/").get(getPublicSmartContractInfo);

module.exports = router;

