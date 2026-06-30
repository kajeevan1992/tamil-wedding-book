const bcrypt = require("bcrypt");
const Chance = require("chance");
const db = require("../models");
const User = db.User;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //? Usage of chance generator || random generation of seeder data
    // const chanceGenerator = new Chance();
    // firstName: chanceGenerator.first(),
    // lastName: chanceGenerator.last(),
    // email: chanceGenerator.email().toLowerCase(),

    const passwordHash = await bcrypt.hash("password", 10);
    const point = { type: 'Point', coordinates: [-0.1275862, 51.5072178] }; // GeoJson format: [lng, lat]
    const userData = []

    userData.push(
      {
        fullName: "Tamil Admin",
        email: "admin@tamilweddingbook.com",
        password: passwordHash,
        address: "London, UK",
        location: point,
        telephone: "+44 7490 772179",
        role: "admin",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    await User.bulkCreate(userData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {})
    return true
  },
}
