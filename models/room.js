"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Round, {
        foreignKey: "roomId",
      });
      this.belongsTo(models.User, {
        foreignKey: "roomMaster",
        as: "user",
      });
      this.belongsToMany(models.User, {
        through: "UserRooms",
        foreignKey: "roomId",
      });
    }
  }
  Room.init(
    {
      roomName: DataTypes.INTEGER,
      roomMaster: DataTypes.INTEGER,
      winner: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "Rooms",
    }
  );
  return Room;
};
