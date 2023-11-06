const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    validateId,
    handleValidationErrors,
    validateBookingInput,
    checkAvailability,
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
                            Sequelize.fn(
                                "COALESCE",
                                Sequelize.fn(
                                    "MAX",
                                    Sequelize.col("SpotImages.url")
                                ),
                                null
                            ),
                            "previewImage",
                        ],
                        //     [
                        //         Sequelize.literal(`(
                        //     SELECT url FROM images
                        //     WHERE Images.imageableType = 'Spot'
                        //     AND images.imageableId = Spot.id
                        //     AND images.preview = true
                        //     LIMIT 1
                        // )`),
                        //         `previewImage`,
                        //     ],
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

//$ Edit a Booking - PUT /api/bookings/:bookingId
router.put(
    "/:bookingId",
    requireAuth,
    validateId(Booking, "bookingId", "guest"),
    validateBookingInput,
    handleValidationErrors,
    checkAvailability,
    async (req, res, next) => {
        try {
            const bookingId = +req.params.bookingId;
            const editBooking = await Booking.update(
                {
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                },
                {
                    where: {
                        id: bookingId,
                    },
                }
            );
            const updatedBooking = await Booking.findByPk(bookingId);
            return res.status(200).json({ updatedBooking });
        } catch (error) {
            next(error);
        }
    }
);

//$ Delete a Booking - DELETE /api/bookings/:bookingId
router.delete(
    "/:bookingId",
    validateId(Booking, "bookingId", "guest"),
    async (req, res, next) => {
        try {
            const deleteBooking = await Booking.destroy({
                where: {
                    id: +req.params.bookingId,
                },
            });
            res.status(200).json({ message: "Successfully deleted" });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
