'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("users", "username", Sequelize.STRING)
    return queryInterface.addColumn("users", "password", Sequelize.TEXT);
  },
  
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("users", "username")
    return queryInterface.removeColumn("users", "password");
  }
};
