/*
 1. "express - validator" checks incoming req and adds errors to the stack.
 2. "validationResult" collects errors in Result object, with a formatter
           method
 3. "handleValidationErrors" is called as the last middleware for a route,
           processing the stack of errors. handy and beautiful piece of code.
*/

const { check, validationResult } = require("express-validator");
const {
    Image,
    Review,
    Spot,
    User,
    Booking,
    Sequelize,
} = require("../db/models");
const { Op } = require("sequelize");

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    //# What does validationResult look like? -------------------
    console.log(validationErrors);
    /* EDIT REVIEW VALIDATION ERROR
   Result {
  formatter: [Function: formatter],
  errors: [
    {
      value: '',
      msg: 'Review text is required',
      param: 'review',
      location: 'body'
    },
    {
      value: -3,
      msg: 'Stars must be an integer from 1 to 5',
      param: 'stars',
      location: 'body'
    }
  ]
}*/
    //# --------------------------------------------------------------

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

//? checks all req.body values against constraints
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

//? validateId checks for existing record, and for authorized user role. "auth" arg is a boolean: user role authorization?
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

//? req.body constraints
const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
];

//? create booking - check body constraints
const validateBookingInput = [
    check("startDate")
        .isISO8601()
        //     // .isDate()
        .withMessage("Start date must be a valid date"),
    check("endDate")
        .isISO8601()
        // .isDate()
        .withMessage("End date must be a valid date")
        .custom((input, { req }) => {
            if (input <= req.body.startDate) {
                throw new Error("endDate cannot be on or before startDate");
            }
            return true;
        }),
];

const validateBooking = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { spotId } = req.params;
    ``;

    const conflictingBookings = await Booking.findAll({
        where: {
            spotId: spotId,
            [Op.or]: [
                //? [Op.or] is an array of conditionals, checking each element for truthiness
                {
                    startDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    [Op.and]: [
                        {
                            startDate: { [Op.lte]: startDate },
                        },
                        {
                            endDate: { [Op.gte]: endDate },
                        },
                    ],
                },
            ],
        },
    });

    if (conflictingBookings.length) {
        return res.status(403).json({
            message:
                "Sorry, this spot is already booked for the specified dates",
        });
    }

    next();
};

module.exports = {
    handleValidationErrors,
    validateSpot,
    validateId,
    validateReview,
    validateBookingInput,
    validateBooking,
};
