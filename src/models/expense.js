module.exports = (sequelize, DataTypes) => {
    const Expense = sequelize.define('Expense', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      concept: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paidBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fundedBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      purchaseLocation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  
    return Expense;
  };