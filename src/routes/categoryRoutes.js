const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly, publicAccess } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique de la catégorie
 *         name:
 *           type: string
 *           description: Nom de la catégorie
 *       example:
 *         id: "64b7e8345e4d9e0001e45dff"
 *         name: "Processeurs"
 */

/**
 * @swagger
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API pour gérer les catégories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lister toutes les catégories
 *     tags: [Categories]
 *     description: "Récupérer la liste des catégories disponibles."
 *     responses:
 *       200:
 *         description: "Liste des catégories"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Ajouter une nouvelle catégorie (admin only)
 *     tags: [Categories]
 *     description: "Créer une nouvelle catégorie."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: "Catégorie créée avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: "La catégorie existe déjà"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie (admin only)
 *     tags: [Categories]
 *     description: "Modifier une catégorie existante par son ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de la catégorie
 *             example:
 *               name: "Cartes Graphiques"
 *     responses:
 *       200:
 *         description: "Catégorie mise à jour avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: "Catégorie non trouvée"
 *       400:
 *         description: "Une catégorie avec ce nom existe déjà"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie (admin only)
 *     tags: [Categories]
 *     description: "Supprimer une catégorie existante par son ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: "Catégorie supprimée avec succès"
 *       404:
 *         description: "Catégorie non trouvée"
 *       500:
 *         description: "Erreur interne"
 */

// Lister les catégories
router.get('/', publicAccess, getCategories);

// Ajouter une catégorie
router.post('/', protect, adminOnly, addCategory);

// Mettre à jour une catégorie
router.put('/:id', protect, adminOnly, updateCategory);

// Supprimer une catégorie
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
