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

    get formatDate(){
      return this.appointmentDate.toISOString().split('T')[0]
    }
  }
  Appointment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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