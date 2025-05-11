const express = require('express');
const {
  getComponentsByCategory,
  getComponentDetails,
  addComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/componentController');
const { protect, publicAccess, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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
 *     Component:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         brand:
 *           type: string
 *         specs:
 *           type: object
 *         image:
 *           type: string
 *           description: Image encodée en base64
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *               partnerName:
 *                 type: string
 *               price:
 *                 type: number
 */

/**
 * @swagger
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Composants
 *   description: API pour gérer les composants
 */

/**
 * @swagger
 * /api/components/category/{categoryName}:
 *   get:
 *     summary: "Lister les composants d'une catégorie"
 *     tags: [Composants]
 *     description: "Récupère tous les composants associés à une catégorie spécifique."
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nom de la catégorie"
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
 *     tags: [Composants]
 *     description: "Récupère les informations détaillées d'un composant spécifique."
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
 *     summary: "Ajouter un composant (admin only)"
 *     tags: [Composants]
 *     description: "Ajoute un nouveau composant."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom du composant"
 *                 example: "Processeur Intel i7"
 *               category:
 *                 type: string
 *                 description: "Nom de la catégorie"
 *                 example: "Processeurs"
 *               brand:
 *                 type: string
 *                 description: "Marque du composant"
 *                 example: "Intel"
 *               specs:
 *                 type: object
 *                 description: "Spécifications du composant"
 *                 example: {"cores": 8, "threads": 16, "baseClock": "3.6GHz", "boostClock": "5.0GHz"}
 *               image:
 *                 type: string
 *                 description: "Image du composant (base64)"
 *                 format: binary
 *     responses:
 *       201:
 *         description: "Composant créé avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: "Erreur de validation"
 *       500:
 *         description: "Erreur interne"
 */

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: "Mettre à jour un composant (admin only)"
 *     tags: [Composants]
 *     description: "Met à jour les informations d'un composant existant."
 *     security:
 *       - BearerAuth: []
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom du composant"
 *                 example: "Processeur Intel i7"
 *               category:
 *                 type: string
 *                 description: "Nom de la catégorie"
 *                 example: "Processeurs"
 *               brand:
 *                 type: string
 *                 description: "Marque du composant"
 *                 example: "Intel"
 *               specs:
 *                 type: object
 *                 description: "Spécifications du composant"
 *                 example: {"cores": 8, "threads": 16, "baseClock": "3.6GHz", "boostClock": "5.0GHz"}
 *               image:
 *                 type: string
 *                 description: "Image du composant (base64)"
 *                 format: binary
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
 *     summary: "Supprimer un composant (admin only)"
 *     tags: [Composants]
 *     description: "Supprime un composant existant."
 *     security:
 *       - BearerAuth: []
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
router.post('/', protect, adminOnly, upload.single('image'), addComponent);

// Mettre à jour un composant
router.put('/:id', protect, adminOnly, upload.single('image'), updateComponent);

// Supprimer un composant
router.delete('/:id', protect, adminOnly, deleteComponent);

module.exports = router;
