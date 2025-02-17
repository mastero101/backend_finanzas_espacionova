module.exports = (sequelize, DataTypes) => {
    const Receipt = sequelize.define('Receipt', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Receipt;
  };