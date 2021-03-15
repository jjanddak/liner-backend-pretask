'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class highlight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      highlight.belongsTo(models.user, { foreignKey: "user_id", targetKey: "id"});
      highlight.belongsTo(models.page, { foreignKey: "page_id", targetKey: "id"});
    }
  };
  highlight.init({
    user_id: DataTypes.INTEGER,
    page_id: DataTypes.INTEGER,
    color_id: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'highlight',
  });
  return highlight;
};