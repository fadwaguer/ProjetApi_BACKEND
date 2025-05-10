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
 *     Partner:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *           description: URL de l'image
 */

/**
 * @swagger
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: "Lister toutes les catégories"
 *     description: "Cette route permet de récupérer toutes les catégories disponibles."
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
 *     summary: "Ajouter une nouvelle catégorie"
 *     description: "Cette route permet d'ajouter une nouvelle catégorie."
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
 *     summary: "Mettre à jour une catégorie"
 *     description: "Cette route permet de mettre à jour une catégorie existante."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la catégorie à mettre à jour"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: "Catégorie mise à jour avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: "Catégorie non trouvée"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: "Supprimer une catégorie"
 *     description: "Cette route permet de supprimer une catégorie existante."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la catégorie à supprimer"
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
