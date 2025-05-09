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
const { protect } = require('../middleware/authMiddleware');
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
 * /api/partners/component-prices:
 *   get:
 *     summary: Lister les prix pour tous les composants
 *     description: Récupère les prix proposés par les partenaires pour chaque composant.
 *     security:
 *       - BearerAuth: []
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
 *                     description: Nom du composant
 *                   prices:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         partner:
 *                           type: string
 *                           description: Nom du partenaire
 *                         price:
 *                           type: number
 *                           description: Prix du composant
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       500:
 *         description: Erreur interne
 */
router.get('/component-prices', protect, getPricesForAllComponents);

/**
 * @swagger
 * /api/partners/components/{componentId}/prices:
 *   get:
 *     summary: Lister les prix pour un composant spécifique
 *     description: Récupère les prix associés à un composant donné.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du composant
 *     responses:
 *       200:
 *         description: Liste des prix pour le composant avec les partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   partner:
 *                     type: string
 *                     description: Nom du partenaire
 *                   price:
 *                     type: number
 *                     description: Prix du composant
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur interne
 */
router.get('/components/:componentId/prices', protect, listPricesByComponent);

/**
 * @swagger
 * /api/partners/calculate-cost:
 *   post:
 *     summary: Calculer le coût total d'une configuration
 *     description: Calcule le coût total en fonction des composants sélectionnés.
 *     security:
 *       - BearerAuth: []
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
 *         description: Non autorisé (token manquant ou invalide)
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne
 */
router.post('/calculate-cost', protect, calculateTotalCost);

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Ajouter un partenaire
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
 *                 description: Le nom du partenaire
 *                 example: "TechSupply Co."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: L'image du partenaire (optionnel)
 *     responses:
 *       201:
 *         description: Partenaire ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Partenaire ajouté avec succès."
 *                 partner:
 *                   $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Un partenaire avec ce nom existe déjà."
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de l'ajout du partenaire."
 *                 error:
 *                   type: string
 *                   example: "Détails de l'erreur interne."
 */
router.post('/', protect, upload.single('image'), addPartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     description: Met à jour les informations d'un partenaire existant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/:id', protect, updatePartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Supprimer un partenaire
 *     description: Supprime un partenaire existant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du partenaire
 *     responses:
 *       200:
 *         description: Partenaire supprimé avec succès
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/:id', protect, deletePartner);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Récupérer tous les partenaires marchands
 *     description: Récupère tous les partenaires marchands enregistrés.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   partnerName:
 *                     type: string
 *                     description: "Nom du partenaire"
 *                   partnerId:
 *                     type: string
 *                     description: "Identifiant du partenaire"
 *                   image:
 *                     type: string
 *                     description: "Type MIME de l'image du partenaire (si disponible)"
 *       401:
 *         description: "Non autorisé (token manquant ou invalide)"
 *       500:
 *         description: "Erreur interne"
 */
router.get('/', protect, getAllPartners);

/**
 * @swagger
 * /api/partners/component-prices:
 *   post:
 *     summary: "Ajouter un prix pour un composant"
 *     description: "Ajoute un prix pour un composant proposé par un partenaire."
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
 *       401:
 *         description: "Non autorisé (token manquant ou invalide)"
 *       400:
 *         description: "Une erreur s'est produite, par exemple : prix déjà existant pour ce partenaire et composant"
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
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: "Non autorisé (token manquant ou invalide)"
 *       400:
 *         description: "Le partenaire, le composant et le nouveau prix sont requis"
 *       404:
 *         description: "Prix ou partenaire non trouvé"
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
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: "Non autorisé (token manquant ou invalide)"
 *       404:
 *         description: "Prix non trouvé"
 *       500:
 *         description: "Erreur interne"
 */
router.delete('/component-prices/:id', protect, deletePriceForComponent);

module.exports = router;
