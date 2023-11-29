// old code graveyard


//$ ALL SPOTS - GET /api/spots
router.get("/", async (req, res) => {
    // Extract query parameters from the request with default values
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    //  'whereObj' object to filter spots based on the query parameters
    const whereObj = {};

    if (minLat) {
        whereObj.lat = { [Sequelize.Op.gte]: minLat };
    }
    if (maxLat) {
        whereObj.lat = { ...whereObj.lat, [Sequelize.Op.lte]: maxLat };
    }
    if (minLng) {
        whereObj.lng = { [Sequelize.Op.gte]: minLng };
    }
    if (maxLng) {
        whereObj.lng = { ...whereObj.lng, [Sequelize.Op.lte]: maxLng };
    }
    if (minPrice) {
        whereObj.price = { [Sequelize.Op.gte]: minPrice };
    }
    if (maxPrice) {
        whereObj.price = { ...whereObj.price, [Sequelize.Op.lte]: maxPrice };
    }

    const errors = {}; // Object to hold any validation errors

    if (isNaN(page) || page < 1 || page > 10) {
        errors.page = "Page must be between 1 and 10";
    }
    if (isNaN(size) || size < 1 || size > 20) {
        errors.size = "Size must be between 1 and 20";
    }
    if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
        errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
        errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
        errors.minLng = "Minimum longitude is invalid";
    }
    if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
        errors.maxLng = "Maximum longitude is invalid";
    }
    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors,
        });
    }

    // Paginate the results
    const offset = (page - 1) * size;

    try {
        // Construct the query options for filtering
        const findSpot = {
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
                "description",
                "price",
                "createdAt",
                "updatedAt",
                //? commented for testing 231128:
                // [
                //     Sequelize.fn(
                //         "COALESCE",
                //         Sequelize.fn(
                //             "ROUND",
                //             Sequelize.col("Reviews.stars"),
                //             1
                //         ),
                //         null
                //     ),
                //     "avgRating",
                // ],
                [
                    Sequelize.fn(
                        "COALESCE",
                        Sequelize.fn("MAX", Sequelize.col("SpotImages.url")),
                        null
                    ),
                    "previewImage",
                ],
            ],
            include: [
                {
                    model: Review,
                    as: "Reviews",
                    attributes: ['stars'],
                },
                // {
                //     model: Image,
                //     as: "SpotImages",
                //     attributes: ["url"],
                //     where: { preview: true },
                //     required: false,
                // },
                {
                    model: Image,
                    as: "SpotImages",
                    attributes: [],
                    where: {
                        imageableType: "Spot",
                        preview: true,
                    },
                    required: false, // This allows spots without images to still be included
                },
            ],
            where: whereObj, // Add the 'whereObj' object to the query
            raw: true,
            nest: true,
            group: ["Spot.id", "Reviews.stars"],
            includeIgnoreAttributes: false,
            order: [["id", "ASC"]],
        };

        // console.log("_____findSpot", findSpot);

        const spots = await Spot.findAll({
            ...findSpot,
            offset,
            // limit: size,
        });

        const findReview = spots.forEach(async spot => {
            const currReview = await Review.findAll({
                where: {
                    spotId: spot.id
                },
                attributes: ['stars'],
            })
            console.log('current review:---->',currReview.stars);
        });
        console.log("----->spots", spots);

        const responseObj = {
            Spots: spots,
            page: Number(page),
            size: Number(size),
        };

        // const responseObj = { Spots: spots };

        // if (req.query.page) {
        //     responseObj.page = Number(page);
        // }
        // if (req.query.size) {
        //     responseObj.size = Number(size);
        // }

        res.status(200).json(responseObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// router.get("/", async (req, res) => {
//     // Default values for pagination
//     const page = parseInt(req.query.page) || 1;
//     const size = parseInt(req.query.size) || 20;

//     // Build the query options for pagination
//     const pagination = {
//         limit: size,
//         offset: (page - 1) * size,
//     };

//     // Build the query options for filtering
//     const filterOptions = {
//         where: {},
//         include: [
//             {
//                 model: Review,
//                 attributes: [],
//             },
//             {
//                 model: Image,
//                 attributes: [],
//                 where: {
//                     preview: true,
//                 },
//                 required: false,
//             },
//         ],
//         group: ["Spot.id"],
//         ...pagination,
//     };

//     // Add optional filters if provided
//     if (req.query.minLat)
//         filterOptions.where.lat = { [Op.gte]: parseFloat(req.query.minLat) };
//     if (req.query.maxLat)
//         filterOptions.where.lat = { [Op.lte]: parseFloat(req.query.maxLat) };
//     if (req.query.minLng)
//         filterOptions.where.lng = { [Op.gte]: parseFloat(req.query.minLng) };
//     if (req.query.maxLng)
//         filterOptions.where.lng = { [Op.lte]: parseFloat(req.query.maxLng) };
//     if (req.query.minPrice)
//         filterOptions.where.price = {
//             [Op.gte]: parseFloat(req.query.minPrice),
//         };
//     if (req.query.maxPrice)
//         filterOptions.where.price = {
//             [Op.lte]: parseFloat(req.query.maxPrice),
//         };

//     try {
//         const spots = await Spot.findAll(filterOptions);
//         res.status(200).json({
//             Spots: spots,
//             page: page,
//             size: size,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Bad Request",
//             errors:
//                 error.errors ||
//                 "An error occurred while processing your request",
//         });
//     }
// });

// router.get("/", async (req, res, next) => {
//     try {
//         const allSpots = await Spot.findAll({
//             attributes: [
//                 "id",
//                 "ownerId",
//                 "address",
//                 "city",
//                 "state",
//                 "country",
//                 "lat",
//                 "lng",
//                 "name",
//                 "description",
//                 "price",
//                 "createdAt",
//                 "updatedAt",
//                 [
//                     Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
//                     "avgStarRating",
//                 ],
//                 [
//                     Sequelize.fn(
//                         "COALESCE",
//                         Sequelize.fn("MAX", Sequelize.col("SpotImages.url")),
//                         null
//                     ),
//                     "previewImage",
//                 ],
//                 // [
//                 //     Sequelize.fn(
//                 //         "COALESCE",
//                 //         Sequelize.fn(
//                 //             "MAX",
//                 //             Sequelize.literal(
//                 //                 "(CASE WHEN images.preview THEN images.url ELSE NULL END)"
//                 //             )
//                 //         ),
//                 //         null
//                 //     ),
//                 //     "previewImage",
//                 // ],
//             ],
//             include: [
//                 {
//                     model: Review,
//                     attributes: [],
//                 },
//                 {
//                     model: Image,
//                     as: "SpotImages",
//                     attributes: [],
//                     where: {
//                         imageableType: "Spot",
//                         preview: true,
//                     },
//                     required: false, // This allows spots without images to still be included
//                 },
//                 // {
//                 //     model: Image,
//                 //     as: "SpotImages",
//                 //     attributes: ["url"],
//                 //     // where: { //! res.json(allSpots) === [] if(!image)
//                 //     //     preview: true,
//                 //     // }
//                 // },
//             ],
//             group: ["Spot.id", /*"Image.id"*/],
//         });
//         res.json(allSpots);
//     } catch (err) {
//         next(err);
//     }
// });
