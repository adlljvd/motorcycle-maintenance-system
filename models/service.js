'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Service.hasMany(models.Appointment, { foreignKey: 'ServiceId' });
      Service.belongsToMany(models.Motorcycle, {
        through: models.Appointment, 
        foreignKey: 'ServiceId'
      });
    }
  }
  Service.init({
    serviceName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    imageURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};