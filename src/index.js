require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const { createExpense, getExpenses, updateExpense, deleteExpense, getExpenseById } = require('./controllers/expenseController');
const { createReceipt, getReceipts, getReceiptsByExpense, updateReceipt, deleteReceipt, uploadImage, downloadReceipt } = require('./controllers/receiptController');
const { createUser, getUsers, updateUser, deleteUser, loginUser } = require('./controllers/userController');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Sincronización y conexión de base de datos
const initializeDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexión a NeonDB establecida correctamente');
    
    await db.sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (err) {
    console.error('❌ Error de base de datos:', err);
  }
};

initializeDB();

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: 'API Finanzas Espacio Nova funcionando correctamente',
        version: '1.0.0'
    });
});

// Health Check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        service: 'Finanzas Espacio Nova API',
        version: '1.0.0',
        database: {
            status: db.sequelize.authenticate().then(() => 'Connected').catch(() => 'Disconnected')
        }
    });
});

// Rutas de gastos
app.get('/api/expenses', getExpenses);
app.post('/api/expenses', createExpense);
app.put('/api/expenses/:id', updateExpense);
app.delete('/api/expenses/:id', deleteExpense);
app.get('/api/expenses/:id', getExpenseById);

// Rutas de recibos
app.post('/api/receipts', createReceipt);
app.get('/api/receipts', getReceipts);
app.get('/api/receipts/expense/:expenseId', getReceiptsByExpense);
app.put('/api/receipts/:id', updateReceipt);
app.delete('/api/receipts/:id', deleteReceipt);
app.post('/api/upload', uploadImage);
app.get('/api/receipts/:id/download', downloadReceipt);

// Rutas de usuarios
app.post('/api/users', createUser);
app.get('/api/users', getUsers);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);
app.post('/api/login', loginUser);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Algo salió mal!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});