const { Receipts, Expenses } = require('../models');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');

/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       required:
 *         - url
 *         - ExpenseId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del recibo
 *         url:
 *           type: string
 *           description: URL de la imagen del recibo
 *         filename:
 *           type: string
 *           description: Nombre del archivo
 *         thumbnailUrl:
 *           type: string
 *           description: URL de la miniatura de la imagen
 *         deleteUrl:
 *           type: string
 *           description: URL para eliminar la imagen
 *         ExpenseId:
 *           type: integer
 *           description: ID del gasto asociado
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/receipts:
 *   get:
 *     summary: Obtener todos los recibos
 *     tags: [Receipts]
 *     responses:
 *       200:
 *         description: Lista de recibos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
/**
 * @swagger
 * /api/receipts/{expenseId}:
 *   get:
 *     summary: Obtener recibos por ID de gasto
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del gasto asociado
 *     responses:
 *       200:
 *         description: Lista de recibos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: No se encontraron recibos para este gasto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
/**
 * @swagger
 * /api/receipts/{id}:
 *   put:
 *     summary: Actualizar un recibo
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recibo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: Nueva URL de la imagen del recibo
 *               filename:
 *                 type: string
 *                 description: Nuevo nombre del archivo
 *     responses:
 *       200:
 *         description: Recibo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Recibo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
/**
 * @swagger
 * /api/receipts/{id}:
 *   delete:
 *     summary: Eliminar un recibo
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recibo a eliminar
 *     responses:
 *       204:
 *         description: Recibo eliminado exitosamente
 *       404:
 *         description: Recibo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen de recibo
 *     tags: [Receipts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - expenseId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del recibo
 *               expenseId:
 *                 type: integer
 *                 description: ID del gasto asociado
 *     responses:
 *       201:
 *         description: Recibo subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recibo creado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     receipt:
 *                       $ref: '#/components/schemas/Receipt'
 *                     imageData:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         delete_url:
 *                           type: string
 *                         thumbnail:
 *                           type: string
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Gasto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
const createReceipt = async (req, res) => {
  const { url, filename, expenseId } = req.body;

  try {
    // Verificar que el gasto relacionado exista
    const expense = await Expenses.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    const newReceipt = await Receipts.create({
      url,
      filename,
      ExpenseId: expenseId
    });

    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error al crear el recibo:', error);
    res.status(500).json({ error: 'Error al crear el recibo' });
  }
};

const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipts.findAll();
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recibos' });
  }
};

const getReceiptsByExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const receipts = await Receipts.findAll({
      where: { ExpenseId: expenseId }
    });

    if (receipts.length === 0) {
      return res.status(404).json({ error: 'No se encontraron recibos para este gasto' });
    }

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recibos' });
  }
};

const updateReceipt = async (req, res) => {
  const { id } = req.params;
  const { url, filename } = req.body;

  try {
    const receipt = await Receipts.findByPk(id);
    if (!receipt) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    receipt.url = url || receipt.url;
    receipt.filename = filename || receipt.filename;

    await receipt.save();
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el recibo' });
  }
};

const deleteReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await Receipts.findByPk(id);
    if (!receipt) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    await receipt.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el recibo' });
  }
};

const uploadImage = async (req, res) => {
  const { file } = req.files;
  const { expenseId } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
  }

  if (!expenseId) {
    return res.status(400).json({ error: 'Se requiere el ID del gasto (expenseId)' });
  }

  try {
    // Verificar que el gasto relacionado exista
    const expense = await Expenses.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    // Convertir la imagen a base64
    const base64Image = file.data.toString('base64');

    // Crear el form data
    const formData = new FormData();
    formData.append('image', base64Image);

    // Subir imagen a ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      params: {
        key: process.env.IMGBB_API_KEY
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Crear el recibo en la base de datos
    const newReceipt = await Receipts.create({
      url: response.data.data.url,
      filename: file.name,
      ExpenseId: expenseId,
      thumbnailUrl: response.data.data.thumb?.url,
      deleteUrl: response.data.data.delete_url
    });

    res.status(201).json({ 
      message: 'Recibo creado exitosamente',
      data: {
        receipt: newReceipt,
        imageData: {
          url: response.data.data.url,
          delete_url: response.data.data.delete_url,
          thumbnail: response.data.data.thumb?.url
        }
      }
    });

  } catch (error) {
    console.error('Error al procesar el recibo:', error);
    res.status(500).json({ 
      error: 'Error al procesar el recibo',
      details: error.response?.data || error.message
    });
  }
};

const downloadReceipt = async (req, res) => {
  try {
    const receipt = await Receipts.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    const response = await axios.get(receipt.url, {
      responseType: 'stream'
    });

    res.setHeader('Content-Disposition', `attachment; filename="${receipt.filename}"`);
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error descargando recibo:', error);
    res.status(500).json({ error: 'Error al descargar el recibo' });
  }
};

module.exports = {
  createReceipt,
  getReceipts,
  getReceiptsByExpense,
  updateReceipt,
  deleteReceipt,
  uploadImage,
  downloadReceipt
}; 