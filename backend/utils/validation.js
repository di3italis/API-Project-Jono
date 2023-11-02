const { check, validationResult } = require("express-validator");
const { Image, Review, Spot, User, Sequelize } = require("../db/models");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
//? handleValidationErrors is called as the last middleware for a route, so that any other validators that have added errors to the stack can be read and processed. a really handy and beautiful piece of code.
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach((error) => (errors[error.path] = error.msg));

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

const validateSpot = [
    check("address")
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check("lat").isFloat().withMessage("Latitude is not valid"),
    check("lng").isFloat().withMessage("Longitude is not valid"),
    check("name")
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("price").isFloat().withMessage("Price per day is required"),
];

//? old validate spotId, now made polymorphic below...🤯
// const validateSpotId = async (req, res, next) => {
//     const { spotId } = req.params;
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//         return res.status(404).json({ message: "Spot couldn't be found" });
//     }
//   next();
// };

const validateId = (model, param, auth) => {
    return async (req, res, next) => {
        const id = req.params[param];
        let clientId = null;
        const idCheck = await model.findByPk(id);

        if (!idCheck) {
            return res.status(404).json({
                message: `${model.name} couldn't be found`,
            });
        }

        if (model === Spot) {
            clientId = idCheck.ownerId;
        } else {
            clientId = idCheck.userId;
        }

        if (auth && clientId && clientId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};

//? old validate spotOwner, now made polymorphic above...🤯
// const validateSpotOwner = async (req, res, next) => {
//     const { spotId } = req.params;
//     const spot = await Spot.findByPk(spotId);

//     if (spot.ownerId !== req.user.id) {
//         return res.status(403).json({ message: "Forbidden" });
//     }

//     next();
// };

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
];

module.exports = {
    handleValidationErrors,
    validateSpot,
    validateId,
    validateReview,
};
