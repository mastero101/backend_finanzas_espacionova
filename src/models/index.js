const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: console.log
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar modelos
db.User = require('./user')(sequelize, Sequelize);
db.Expense = require('./expense')(sequelize, Sequelize);
db.Receipt = require('./receipt')(sequelize, Sequelize);

// Definir relaciones
db.User.hasMany(db.Expense);
db.Expense.belongsTo(db.User);

db.Expense.hasMany(db.Receipt);
db.Receipt.belongsTo(db.Expense);

// Definición del modelo Expenses
const Expenses = sequelize.define('Expenses', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Definición del modelo Receipts
const Receipts = sequelize.define('Receipts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ExpenseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Expenses', // Nombre de la tabla de gastos
      key: 'id'
    },
    allowNull: false
  }
});

// Relación entre Expenses y Receipts
Expenses.hasMany(Receipts, { foreignKey: 'ExpenseId' });
Receipts.belongsTo(Expenses, { foreignKey: 'ExpenseId' });

// Definición del modelo Users
const Users = sequelize.define('Users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
});

// Exportar el modelo
module.exports = {
  Expenses,
  Receipts,
  Users,
  sequelize
};