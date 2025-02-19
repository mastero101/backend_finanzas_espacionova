const { Expenses, Receipts } = require('../models');

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
 *         - concept
 *         - amount
 *         - projectName
 *         - paidBy
 *         - fundedBy
 *         - purchaseLocation
 *         - paymentDate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del gasto
 *         concept:
 *           type: string
 *           description: Concepto del gasto
 *         amount:
 *           type: number
 *           description: Monto del gasto
 *         projectName:
 *           type: string
 *           description: Nombre del proyecto asociado
 *         paidBy:
 *           type: string
 *           description: Persona que realizó el pago
 *         fundedBy:
 *           type: string
 *           description: Entidad que financió el gasto
 *         purchaseLocation:
 *           type: string
 *           description: Lugar donde se realizó la compra
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: Fecha de pago
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
 *         concept: "Compra de materiales"
 *         amount: 100.50
 *         projectName: "Proyecto X"
 *         paidBy: "Usuario 1"
 *         fundedBy: "Empresa A"
 *         purchaseLocation: "Tienda 1"
 *         paymentDate: "2024-02-16"
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
 *               - concept
 *               - amount
 *               - projectName
 *               - paidBy
 *               - fundedBy
 *               - purchaseLocation
 *               - paymentDate
 *             properties:
 *               concept:
 *                 type: string
 *               amount:
 *                 type: number
 *               projectName:
 *                 type: string
 *               paidBy:
 *                 type: string
 *               fundedBy:
 *                 type: string
 *               purchaseLocation:
 *                 type: string
 *               paymentDate:
 *                 type: string
 *                 format: date
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
    const { concept, amount, projectName, paidBy, fundedBy, purchaseLocation, paymentDate } = req.body;
    
    if (!concept || !amount || !projectName || !paidBy || !fundedBy || !purchaseLocation || !paymentDate) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const newExpense = await Expenses.create({
      concept,
      amount,
      projectName,
      paidBy,
      fundedBy,
      purchaseLocation,
      paymentDate,
      userId: 1 // Temporal hasta autenticación
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
    const expenses = await Expenses.findAll({
      include: [{
        model: Receipts,
        as: 'receipts',  // Usar alias en minúscula
        attributes: ['id', 'url', 'filename']
      }]
    });

    const formattedExpenses = expenses.map(expense => ({
      ...expense.get({ plain: true }),
      paymentDate: expense.paymentDate,
      receipts: expense.receipts.map(r => ({
        id: r.id,
        imageUrl: r.url,
        fileName: r.filename,
        expenseId: r.ExpenseId
      }))
    }));

    res.json(formattedExpenses);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
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
 *               concept:
 *                 type: string
 *               amount:
 *                 type: number
 *               projectName:
 *                 type: string
 *               paidBy:
 *                 type: string
 *               fundedBy:
 *                 type: string
 *               purchaseLocation:
 *                 type: string
 *               paymentDate:
 *                 type: string
 *                 format: date
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
  const { concept, amount, projectName, paidBy, fundedBy, purchaseLocation, paymentDate } = req.body;

  try {
    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    expense.concept = concept || expense.concept;
    expense.amount = amount || expense.amount;
    expense.projectName = projectName || expense.projectName;
    expense.paidBy = paidBy || expense.paidBy;
    expense.fundedBy = fundedBy || expense.fundedBy;
    expense.purchaseLocation = purchaseLocation || expense.purchaseLocation;
    expense.paymentDate = paymentDate || expense.paymentDate;

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
    // Eliminar usando destroy con include para forzar CASCADE si es necesario
    const result = await Expenses.destroy({
      where: { id },
      include: [{
        model: Receipts,
        as: 'receipts'
      }]
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error eliminando gasto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el gasto',
      details: error.message
    });
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