const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    handleValidationErrors,
    validateSpot,
    validateSpotId,
    validateSpotOwner,
    validateReview,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Image, Review, Spot, User, Sequelize } = require("../../db/models");

const router = express.Router();

//$ ALL SPOTS - GET /api/spots
router.get("/", async (req, res) => {
    const allSpots = await Spot.findAll({
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgStarRating",
                ],
            ],
        },
        include: [
            {
                model: Review,
                attributes: [],
            },
            {
                model: Image,
                as: "SpotImages",
                attributes: ["url"],
                // where: { //! res.json(allSpots) === [] if(!image)
                //     preview: true,
                // }
            },
        ],
        group: ["Spot.id"],
    });
    res.json(allSpots);
});

//$ CURRENT USER'S SPOTS - GET /api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({
            where: {
                ownerId: userId,
            },
        });
        res.json({ spots });
    } catch (err) {
        next(err);
    }
});

//$ GET DETAILS FOR SPOT - GET /api/spots/:spotId
//! finish quries for reviews and images
router.get(
    "/:spotId",
    validateSpotId,

    handleValidationErrors,
    async (req, res, next) => {
        // console.log(spotId);
        try {
            const { spotId } = req.params;
            const spotsByID = await Spot.findByPk(spotId, {
                attributes: {
                    include: [
                        [
                            Sequelize.fn("COUNT", Sequelize.col("Reviews.id")),
                            "numReviews",
                        ],
                        [
                            Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                            "avgStarRating",
                        ],
                    ],
                },
                include: [
                    // {
                    //     model: Image,
                    //     as: "SpotImages",
                    //     attributes: ["id", "url", "preview"],
                    //     where: { imageableType: "Spot" },
                    // },
                    {
                        model: User,
                        as: "Owner",
                        attributes: ["id", "firstName", "lastName"],
                    },
                ],
                group: ["Spot.id", "SpotImages.id", "Owner.id"], // can't decide if I like single oor double quotes better... but i digress
            });
            res.json({ spotsByID });
        } catch (err) {
            next(err);
        }
    }
);

//$ NEW SPOT - POST /api/spots
router.post(
    "/",
    requireAuth,
    validateSpot,
    handleValidationErrors,
    async (req, res, next) => {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        const ownerId = req.user.id;

        try {
            const newSpot = await Spot.create({
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            return res.status(201).json(newSpot);
        } catch (err) {
            return res.status(400).json({
                message: "Validation Error",
                errors: err.errors.map((e) => e.message),
            });
        }
    }
);

//$ NEW SPOT IMAGE - POST /api/spots/:spotId/images
router.post(
    "/:spotId/images",
    requireAuth,
    validateSpotId,
    validateSpotOwner,
    handleValidationErrors,
    async (req, res, next) => {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        try {
            const newImage = await Image.create({
                url,
                preview,
                imageableId: spotId,
                imageableType: "Spot",
            });
            // res.json({newImage});
            res.json({
                id: newImage.id,
                url: newImage.url,
                preview: newImage.preview,
            });
        } catch (err) {
            next(err);
        }
    }
);

//$ EDIT SPOT - PUT /api/spots/:spotId
router.put(
    "/:spotId",
    requireAuth,
    validateSpot,
    validateSpotId,
    validateSpotOwner,
    handleValidationErrors,
    async (req, res, next) => {
        const { spotId } = req.params;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        try {
            const editSpot = await Spot.update(
                {
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                },
                {
                    where: {
                        id: spotId,
                    },
                }
            );

            const updatedSpot = await Spot.findByPk(spotId);
            res.status(200).json(updatedSpot);
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }
);

//$ DELETE SPOT - DELETE /api/spots/:spotId
router.delete(
    "/:spotId",
    requireAuth,
    validateSpotId,
    validateSpotOwner,
    async (req, res, next) => {
        const { spotId } = req.params;
        try {
            const spot = await Spot.findByPk(spotId);
            await spot.destroy();

            res.status(200).json({ message: "Successfully deleted" });
        } catch (err) {
            next(err);
        }
    }
);

//# REVIEWS--------------------------------------------------------------
//$ Create a review - POST /api/spots/:spotId/reviews
router.post(
    "/:spotId/reviews",
    requireAuth,
    validateSpotId,
    validateReview,
    handleValidationErrors,
    async (req, res, next) => {
        const userReview = await Review.findOne({
            where: {
                userId: req.user.id,
                spotId: req.params.spotId,
            },
        });

        if (userReview) {
            return res.status(403).json({
                message: "User already has a review for this spot",
            });
        }
        try {
            const { spotId } = req.params;
            const { review, stars } = req.body;

            const newReview = await Review.create({
                userId: req.user.id,
                spotId,
                review,
                stars,
            });

            res.status(201).json({ newReview });
        } catch (err) {
            return res.status(400).json({
                message: "Validation Error",
                errors: err.errors.map((e) => e.message),
            });
        }
    }
);

module.exports = router;
