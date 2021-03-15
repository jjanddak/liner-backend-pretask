'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("highlights", "theme_id");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("highlights", "theme_id", Sequelize.INTEGER);
  }
};
