const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    validateSpot,
    validateSpotId,
    validateSpotOwner,
    handleValidationErrors,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Image, Review, Spot, User, Sequelize } = require("../../db/models");

const router = express.Router();

//$ Get Reviews of Current User - GET /api/reviews/current
router.get("/current", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({
            where: {
                userId: userId,
            },
        });

        res.json({ reviews });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
