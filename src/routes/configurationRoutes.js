const express = require('express');
const {
  createConfiguration,
  getConfigurationsByUserEmail,
  getConfigurationById,
  updateConfiguration,
  deleteConfiguration,
  exportConfigurationToPDF,
  getConfigurationsWithUserDetails,
} = require('../controllers/configurationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

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
 *     Configuration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         components:
 *           type: array
 *           items:
 *             type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             name:
 *               type: string
 */

/**
 * @swagger
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   name: Configurations
 *   description: API pour gérer les configurations
 */

/**
 * @swagger
 * /api/configurations:
 *   post:
 *     summary: "Créer une configuration"
 *     tags: [Configurations]
 *     description: "Ajoute une nouvelle configuration pour un utilisateur."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Email de l'utilisateur"
 *                 example: "john.doe@example.com"
 *               name:
 *                 type: string
 *                 description: "Nom de la configuration"
 *                 example: "Configuration Gaming"
 *               components:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "Identifiants des composants"
 *                 example: ["componentId1", "componentId2"]
 *     responses:
 *       201:
 *         description: "Configuration créée avec succès"
 *       400:
 *         description: "Données invalides"
 *       500:
 *         description: "Erreur interne"
 */
router.post('/', protect, createConfiguration);

/**
 * @swagger
 * /api/configurations/user/{email}:
 *   get:
 *     summary: "Récupérer toutes les configurations d'un utilisateur"
 *     tags: [Configurations]
 *     description: "Renvoie toutes les configurations d'un utilisateur basé sur son adresse e-mail."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: "Adresse e-mail de l'utilisateur"
 *     responses:
 *       200:
 *         description: "Liste des configurations"
 *       404:
 *         description: "Utilisateur ou configurations non trouvés"
 *       500:
 *         description: "Erreur interne"
 */
router.get('/user/:email', protect, getConfigurationsByUserEmail);

/**
 * @swagger
 * /api/configurations/{id}:
 *   get:
 *     summary: "Récupérer une configuration"
 *     tags: [Configurations]
 *     description: "Renvoie les détails d'une configuration spécifique par ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la configuration"
 *     responses:
 *       200:
 *         description: "Détails de la configuration"
 *       404:
 *         description: "Configuration non trouvée"
 *       500:
 *         description: "Erreur interne"
 */
router.get('/:id', protect, getConfigurationById);

/**
 * @swagger
 * /api/configurations/{id}:
 *   put:
 *     summary: "Mettre à jour une configuration"
 *     tags: [Configurations]
 *     description: "Met à jour les détails d'une configuration spécifique."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la configuration"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom de la configuration"
 *                 example: "Configuration Gaming"
 *               components:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "Identifiants des composants"
 *                 example: ["componentId1", "componentId2"]
 *     responses:
 *       200:
 *         description: "Configuration mise à jour avec succès"
 *       404:
 *         description: "Configuration non trouvée"
 *       500:
 *         description: "Erreur interne"
 */
router.put('/:id', protect, updateConfiguration);

/**
 * @swagger
 * /api/configurations/{id}:
 *   delete:
 *     summary: "Supprimer une configuration"
 *     tags: [Configurations]
 *     description: "Supprime une configuration spécifique par ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la configuration"
 *     responses:
 *       200:
 *         description: "Configuration supprimée avec succès"
 *       404:
 *         description: "Configuration non trouvée"
 *       500:
 *         description: "Erreur interne"
 */
router.delete('/:id', protect, deleteConfiguration);

/**
 * @swagger
 * /api/configurations/{id}/export-pdf:
 *   get:
 *     summary: "Exporter une configuration en PDF"
 *     tags: [Configurations]
 *     description: "Génère et télécharge un fichier PDF de la configuration spécifique."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "Identifiant de la configuration"
 *     responses:
 *       200:
 *         description: "PDF généré avec succès"
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: "Configuration non trouvée"
 *       500:
 *         description: "Erreur interne"
 */
router.get('/:id/export-pdf', protect, exportConfigurationToPDF);


/**
 * @swagger
 * /api/configurations:
 *   get:
 *     summary: "Récupérer toutes les configurations avec les détails de l'utilisateur (admin only)"
 *     tags: [Configurations]
 *     description: "Cette route permet de récupérer toutes les configurations avec les détails de l'utilisateur."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Liste des configurations avec les détails de l'utilisateur"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Configuration'
 *       500:
 *         description: "Erreur interne"
 */
router.get('/', protect, adminOnly, getConfigurationsWithUserDetails);

module.exports = router;
