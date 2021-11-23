"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Rounds", "roomId", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "Rooms",
        },
        key: "id",
      },
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Rounds", "roomId");
  },
};
