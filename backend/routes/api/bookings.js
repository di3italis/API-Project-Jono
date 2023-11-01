const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Booking } = require("../../db/models");

const router = express.Router();

module.exports = router;
