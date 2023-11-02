const { User, Spot, Booking, Review, Image } = require("../models");
// Seed Spots
const findUsers = async () => {
try {
    const users = await User.findAll({ order: [["createdAt", "ASC"]] });
    console.log(users);
    // if (firstUser) {
        //     await Spot.bulkCreate([
            //         {
                //             ownerId: firstUser.id,
                //             address: "123 Disney Lane",
                //             city: "San Francisco",
                //             state: "California",
                //             country: "United States of America",
                //             lat: 37.7645358,
                //             lng: -122.4730327,
                //             name: "App Academy",
                //             description: "Place where web developers are created",
                //             price: 123,
                //         },
                //     ]);
                // }

} catch (error) {
    console.error("Error finding users", error);

}
            };
findUsers();
