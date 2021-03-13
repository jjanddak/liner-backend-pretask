'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  page.init({
    url: DataTypes.STRING,
    page_info: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'page',
  });
  return page;
};