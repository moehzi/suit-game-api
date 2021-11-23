"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Biodata, {
        foreignKey: "userId",
        as: "biodata",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Round, {
        foreignKey: "firstPlayerId",
      });
      this.hasMany(models.Round, {
        foreignKey: "secondPlayerId",
      });
      this.hasMany(models.Room, {
        foreignKey: "roomMaster",
      });
      this.belongsToMany(models.Room, {
        through: "UserRooms",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      encryptedPassword: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "PlayerUser",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
