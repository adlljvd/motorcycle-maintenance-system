'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Motorcycle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Motorcycle.belongsTo(models.User, {foreignKey: 'UserId'})
      Motorcycle.hasMany(models.Appointment, { foreignKey: 'MotorcycleId' });
      Motorcycle.belongsToMany(models.Service, {
        through: models.Appointment, 
        foreignKey: 'MotorcycleId'
      });
    }
  }
  Motorcycle.init({
    brand: DataTypes.STRING,
    type: DataTypes.STRING,
    year: DataTypes.INTEGER,
    licensePlate: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Motorcycle',
  });
  return Motorcycle;
};