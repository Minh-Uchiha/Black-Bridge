const express = require("express");
const { inviteAgent } = require("../controllers/Invite.js");

const router = express.Router();

router.post("/", inviteAgent);

module.exports = router;
