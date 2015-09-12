'use strict';
module.exports = function(sequelize, DataTypes) {
  var category = sequelize.define('category', {
    name: {type: DataTypes.STRING, unique: true},
    nameSomali: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.category.hasMany(models.fatwa)    
      }
    }
  });
  return category;
};