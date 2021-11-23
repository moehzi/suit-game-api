"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Room, {
        foreignKey: "roomId",
      });
      this.belongsTo(models.User, {
        foreignKey: "firstPlayerId",
      });
      this.belongsTo(models.User, {
        foreignKey: "secondPlayerId",
      });
    }
  }
  Round.init(
    {
      name: DataTypes.STRING,
      firstPlayerId: DataTypes.INTEGER,
      secondPlayerId: DataTypes.INTEGER,
      firstPlayerSelect: DataTypes.STRING,
      secondPlayerSelect: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      result: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Round",
      tableName: "Rounds",
    }
  );
  return Round;
};
