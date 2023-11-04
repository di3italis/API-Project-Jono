const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    validateId,
    handleValidationErrors,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Booking, Spot, Review, Image, Sequelize } = require("../../db/models");

const router = express.Router();

//$ Get Current User Bookings - GET /api/bookings/current
router.get("/current", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({
            where: {
                userId: userId,
            },
            // attributes: ["id", "spotId"],
            include: [
                {
                    model: Spot,
                    attributes: [
                        "id",
                        "ownerId",
                        "address",
                        "city",
                        "state",
                        "country",
                        "lat",
                        "lng",
                        "name",
                        "price",
                        [
                            Sequelize.literal(`(
                        SELECT url FROM "Images"
                        WHERE Images.imageableType = 'Spot'
                        AND Images.imageableId = Spot.id
                        AND Images.preview = true
                        LIMIT 1
                    )`),
                            `previewImage`,
                        ],
                    ],
                },
            ],
        });
        const formattedBookings = bookings.map((booking) => {
            return {
                id: booking.id,
                spotId: booking.spotId,
                Spot: booking.Spot,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            };
        });

        res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        next(error);
    }
});



module.exports = router;
