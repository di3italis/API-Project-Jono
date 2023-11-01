const { check, validationResult } = require("express-validator");
const { Image, Review, Spot, User, Sequelize } = require("../db/models");


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
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

const validateSpotId = async (req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
  next();
};

const validateSpotOwner = async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  // if (!spot) {
  //   return res.status(404).json({ message: "Spot couldn't be found" });
  // };

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  };

  // req.spot = spot;
  next();
};

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
  .withMessage("Stars must be an integer from 1 to 5")
];

module.exports = {
    handleValidationErrors,
    validateSpot,
    validateSpotId,
    validateSpotOwner,
    validateReview,
};
