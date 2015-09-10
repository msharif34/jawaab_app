'use strict';
module.exports = function(sequelize, DataTypes) {
  var fatwa = sequelize.define('fatwa', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    questionSomali: DataTypes.TEXT,
    answerSomali: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fatwa.belongsTo(models.category)    
      }
    }
  });
  return fatwa;
};