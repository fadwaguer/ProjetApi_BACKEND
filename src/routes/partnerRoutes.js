const express = require('express');
const {
  getPricesForAllComponents,
  calculateTotalCost,
  addPartner,
  updatePartner,
  deletePartner,
  addPriceForComponent,
  updatePriceForComponent,
  deletePriceForComponent,
} = require('../controllers/partnerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/partners/component-prices:
 *   get:
 *     summary: "Lister les prix pour tous les composants"
 *     description: "Récupère les prix proposés par les partenaires pour chaque composant."
 *     responses:
 *       200:
 *         description: "Liste des prix par composant"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   component:
 *                     type: string
 *                     description: "Nom du composant"
 *                   prices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         partner:
 *                           type: string
 *                           description: "Nom du partenaire"
 *                         price:
 *                           type: number
 *                           description: "Prix du composant"
 *     500:
 *       description: "Erreur interne"
 */
router.get('/component-prices', protect, getPricesForAllComponents);

/**
 * @swagger
 * /api/partners/calculate-cost:
 *   post:
 *     summary: "Calculer le coût total d'une configuration"
 *     description: "Calcule le coût total en fonction des composants sélectionnés et de leurs prix."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               description: "Identifiant du composant sélectionné"
 *     responses:
 *       200:
 *         description: "Coût total calculé"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCost:
 *                   type: number
 *                   description: "Coût total"
 *       400:
 *         description: "Requête invalide"
 *       500:
 *         description: "Erreur interne"
 */
router.post('/calculate-cost', protect, calculateTotalCost);

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: "Ajouter un partenaire"
 *     description: "Ajoute un nouveau partenaire marchand."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       201:
 *         description: "Partenaire ajouté avec succès"
 *       500:
 *         description: "Erreur interne"
 */
router.post('/', protect, addPartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: "Mettre à jour un partenaire"
 *     description: "Met à jour les informations d'un partenaire existant."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du partenaire"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       200:
 *         description: "Partenaire mis à jour avec succès"
 *       404:
 *         description: "Partenaire non trouvé"
 *       500:
 *         description: "Erreur interne"
 */
router.put('/:id', protect, updatePartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: "Supprimer un partenaire"
 *     description: "Supprime un partenaire existant."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du partenaire"
 *     responses:
 *       200:
 *         description: "Partenaire supprimé avec succès"
 *       404:
 *         description: "Partenaire non trouvé"
 *       500:
 *         description: "Erreur interne"
 */
router.delete('/:id', protect, deletePartner);

/**
 * @swagger
 * /api/partners/component-prices:
 *   post:
 *     summary: "Ajouter un prix pour un composant"
 *     description: "Ajoute un prix pour un composant proposé par un partenaire."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *                 description: "Identifiant du partenaire"
 *               componentId:
 *                 type: string
 *                 description: "Identifiant du composant"
 *               price:
 *                 type: number
 *                 description: "Prix du composant"
 *     responses:
 *       201:
 *         description: "Prix ajouté avec succès"
 *       500:
 *         description: "Erreur interne"
 */
router.post('/component-prices', protect, addPriceForComponent);

/**
 * @swagger
 * /api/partners/component-prices/{id}:
 *   put:
 *     summary: "Mettre à jour un prix pour un composant"
 *     description: "Met à jour le prix d'un composant proposé par un partenaire."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du prix"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: "Nouveau prix"
 *     responses:
 *       200:
 *         description: "Prix mis à jour avec succès"
 *       404:
 *         description: "Prix non trouvé"
 *       500:
 *         description: "Erreur interne"
 */
router.put('/component-prices/:id', protect, updatePriceForComponent);

/**
 * @swagger
 * /api/partners/component-prices/{id}:
 *   delete:
 *     summary: "Supprimer un prix pour un composant"
 *     description: "Supprime le prix d'un composant proposé par un partenaire."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant du prix"
 *     responses:
 *       200:
 *         description: "Prix supprimé avec succès"
 *       404:
 *         description: "Prix non trouvé"
 *       500:
 *         description: "Erreur interne"
 */
router.delete('/component-prices/:id', protect, deletePriceForComponent);

module.exports = router;
