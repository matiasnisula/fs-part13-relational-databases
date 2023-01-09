const { DataTypes } = require("sequelize");
// 1991<year<=currentYear
// integer
// give error message if wrong year

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
