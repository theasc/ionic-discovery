'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sentences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Sentences.init({
    username: DataTypes.STRING,
    sentence: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Sentences',
  });
  return Sentences;
};
