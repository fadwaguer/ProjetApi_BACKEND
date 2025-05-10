const express = require('express');
const {
  getPricesForAllComponents,
  listPricesByComponent,
  calculateTotalCost,
  addPartner,
  updatePartner,
  deletePartner,
  addPriceForComponent,
  updatePriceForComponent,
  deletePriceForComponent,
  getAllPartners,
} = require('../controllers/partnerController');
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
 * tags:
 *   name: Partenaires
 *   description: API pour gérer les partenaires marchands
 */

/**
 * @swagger
 * /api/partners/component-prices:
 *   get:
 *     summary: Lister les prix pour tous les composants
 *     tags: [Partenaires]
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
router.get('/component-prices', publicAccess, getPricesForAllComponents);

/**
 * @swagger
 * /api/partners/components/{componentId}/prices:
 *   get:
 *     summary: Lister les prix pour un composant spécifique
 *     tags: [Partenaires]
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
router.get('/components/:componentId/prices', publicAccess, listPricesByComponent);

/**
 * @swagger
 * /api/partners/calculate-cost:
 *   post:
 *     summary: Calculer le coût total d'une configuration
 *     tags: [Partenaires]
 *     description: Calcule le coût total en fonction des composants sélectionnés.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               description: Identifiant du composant
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
 * /api/partners:
 *   post:
 *     summary: Ajouter un partenaire (admin only)
 *     tags: [Partenaires]
 *     description: Ajoute un nouveau partenaire marchand avec un nom et une image optionnelle.
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Partenaire ajouté avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne
 */
router.post('/', protect, adminOnly, upload.single('image'), addPartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire (admin only)
 *     tags: [Partenaires]
 *     description: Met à jour les informations d'un partenaire existant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/:id', protect, adminOnly, updatePartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Supprimer un partenaire (admin only)
 *     tags: [Partenaires]
 *     description: Supprime un partenaire existant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partenaire supprimé avec succès
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/:id', protect, adminOnly, deletePartner);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Récupérer tous les partenaires marchands
 *     tags: [Partenaires]
 *     description: Récupère tous les partenaires marchands enregistrés.
 *     responses:
 *       200:
 *         description: Liste des partenaires
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne
 */
router.get('/', publicAccess, getAllPartners);

/**
 * @swagger
 * /api/partners/component-prices:
 *   post:
 *     summary: Ajouter un prix pour un composant (admin only)
 *     tags: [Partenaires]
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
router.post('/component-prices', protect, adminOnly, addPriceForComponent);

/**
 * @swagger
 * /api/partners/component-prices/{id}:
 *   put:
 *     summary: Mettre à jour un prix pour un composant (admin only)
 *     tags: [Partenaires]
 *     description: Met à jour le prix d'un composant proposé par un partenaire.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
router.put('/component-prices/:id', protect, adminOnly, updatePriceForComponent);

/**
 * @swagger
 * /api/partners/component-prices/{id}:
 *   delete:
 *     summary: Supprimer un prix pour un composant (admin only)
 *     tags: [Partenaires]
 *     description: Supprime le prix d'un composant proposé par un partenaire.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prix supprimé avec succès
 *       404:
 *         description: Prix non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/component-prices/:id', protect, adminOnly, deletePriceForComponent);

module.exports = router;
