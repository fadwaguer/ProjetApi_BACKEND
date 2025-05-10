const express = require('express');
const {
  getComponentsByCategory,
  getComponentDetails,
  addComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/componentController');
const { protect, publicAccess, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

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
 * /api/components/category/{categoryId}:
 *   get:
 *     summary: "Lister les composants d'une catégorie"
 *     description: "Cette route permet de récupérer tous les composants associés à une catégorie spécifique."
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la catégorie"
 *     responses:
 *       200:
 *         description: "Liste des composants"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       404:
 *         description: "Catégorie non trouvée"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: "Détail d'un composant"
 *     description: "Cette route permet de récupérer les informations détaillées d'un composant spécifique."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du composant"
 *     responses:
 *       200:
 *         description: "Détails du composant"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: "Composant non trouvé"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/components:
 *   post:
 *     summary: "Ajouter un composant"
 *     description: "Cette route permet d'ajouter un nouveau composant."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       201:
 *         description: "Composant créé avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: "Le composant existe déjà dans cette catégorie"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: "Mettre à jour un composant"
 *     description: "Cette route permet de modifier un composant existant."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du composant"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: "Composant mis à jour avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: "Composant non trouvé"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: "Supprimer un composant"
 *     description: "Cette route permet de supprimer un composant existant."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du composant"
 *     responses:
 *       200:
 *         description: "Composant supprimé avec succès"
 *       404:
 *         description: "Composant non trouvé"
 *       500:
 *         description: "Erreur interne"
 */

// Lister les composants d'une catégorie
router.get('/category/:categoryName', publicAccess, getComponentsByCategory);

// Détail d'un composant
router.get('/:id', publicAccess, getComponentDetails);

// Ajouter un composant
router.post('/', protect, adminOnly, addComponent);

// Mettre à jour un composant
router.put('/:id', protect, adminOnly, updateComponent);

// Supprimer un composant
router.delete('/:id', protect, adminOnly, deleteComponent);

module.exports = router;
