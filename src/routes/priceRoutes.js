const express = require('express');
const {
  getPricesForAllComponents,
  listPricesByComponent,
  calculateTotalCost,
  addPriceForComponent,
  updatePriceForComponent,
  deletePriceForComponent,
    
} = require('../controllers/priceController');
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
 *     Price:
 *       type: object
 *       properties:
 *         partnerId:
 *           type: string
 *         componentId:
 *           type: string
 *         price:
 *           type: number
 */

/**
 * @swagger
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Prix
 *   description: API pour gérer les prix
 */

/**
 * @swagger
 * /api/prices:
 *   get:
 *     summary: Lister les prix pour tous les composants
 *     tags: [Prix]
 *     description: Récupère les prix proposés par les partenaires pour chaque composant.
 *     responses:
 *       200:
 *         description: Liste des prix par composant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   component:
 *                     type: string
 *                   prices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         partner:
 *                           type: string
 *                         price:
 *                           type: number
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne
 */
router.get('/', publicAccess, getPricesForAllComponents);

/**
 * @swagger
 * /api/prices/component/{componentId}:
 *   get:
 *     summary: Lister les prix pour un composant spécifique
 *     tags: [Prix]
 *     description: Récupère les prix associés à un composant donné.
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du composant
 *     responses:
 *       200:
 *         description: Liste des prix pour le composant
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur interne
 */
router.get('/component/:componentId', publicAccess, listPricesByComponent);

/**
 * @swagger
 * /api/prices/calculate-cost:
 *   post:
 *     summary: Calculer le coût total d'une configuration
 *     tags: [Prix]
 *     description: Calcule le coût total en fonction des composants sélectionnés.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               description: Identifiants des composants
 *           example: 
 *             - "681fa5c78cf0c8df40cc5e15"
 *             - "6820df65f4cffe87f3d1cc57"
 *     responses:
 *       200:
 *         description: Coût total calculé
 *       401:
 *         description: Non autorisé
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne
 */
router.post('/calculate-cost', publicAccess, calculateTotalCost);

/**
 * @swagger
 * /api/prices:
 *   post:
 *     summary: Ajouter un prix pour un composant (admin only)
 *     tags: [Prix]
 *     description: Ajoute un prix pour un composant proposé par un partenaire.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *               componentId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Prix ajouté avec succès
 *       400:
 *         description: Prix déjà existant
 *       500:
 *         description: Erreur interne
 */
router.post('/', protect, adminOnly, addPriceForComponent);

/**
 * @swagger
 * /api/prices:
 *   put:
 *     summary: Mettre à jour un prix pour un composant (admin only)
 *     tags: [Prix]
 *     description: Met à jour le prix d'un composant proposé par un partenaire.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *               componentId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Prix mis à jour avec succès
 *       404:
 *         description: Prix ou partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/', protect, adminOnly, updatePriceForComponent);

/**
 * @swagger
 * /api/prices:
 *   delete:
 *     summary: Supprimer un prix pour un composant (admin only)
 *     tags: [Prix]
 *     description: Supprime le prix d'un composant proposé par un partenaire.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *               componentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prix supprimé avec succès
 *       404:
 *         description: Prix non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/', protect, adminOnly, deletePriceForComponent);

module.exports = router;