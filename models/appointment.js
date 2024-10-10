'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.Motorcycle, {foreignKey: 'MotorcycleId'})
      Appointment.belongsTo(models.Service, { foreignKey: 'ServiceId' });

    }
  }
  Appointment.init({
    appointmentDate: DataTypes.DATE,
    MotorcycleId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    ServiceId: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};