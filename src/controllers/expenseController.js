const { Expenses } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: API para gestionar gastos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - amount
 *         - description
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del gasto
 *         amount:
 *           type: number
 *           description: Monto del gasto
 *         description:
 *           type: string
 *           description: Descripción del gasto
 *         category:
 *           type: string
 *           description: Categoría del gasto
 *         userId:
 *           type: integer
 *           description: ID del usuario que creó el gasto
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         amount: 100.50
 *         description: "Compra de materiales"
 *         category: "Materiales"
 *         userId: 1
 *         createdAt: "2024-02-16T00:00:00.000Z"
 *         updatedAt: "2024-02-16T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Crear un nuevo gasto
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    
    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser un número positivo' });
    }

    const newExpense = await Expenses.create({
      amount,
      description,
      category,
      date,
      userId: 1 // Temporal hasta implementar autenticación
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error al crear el gasto:', error);
    res.status(500).json({ error: 'Error al crear el gasto', details: error.message });
  }
};

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Obtener todos los gastos
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Lista de todos los gastos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       500:
 *         description: Error del servidor
 */
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.findAll();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
};

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Actualizar un gasto
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del gasto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gasto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error del servidor
 */
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;

  try {
    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
};

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Eliminar un gasto
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del gasto
 *     responses:
 *       204:
 *         description: Gasto eliminado exitosamente
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error del servidor
 */
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    await expense.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expenses.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json(expense);
  } catch (error) {
    console.error('Error al obtener el gasto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById
}; 