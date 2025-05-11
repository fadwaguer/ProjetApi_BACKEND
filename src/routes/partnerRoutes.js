const express = require('express');
const {
  addPartner,
  updatePartner,
  deletePartner,
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
 *                 description: Nom du partenaire
 *                 example: "Amazon"
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du partenaire
 *                 example: "Amazon"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/:id', protect, adminOnly, upload.single('image'), updatePartner);

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

module.exports = router;
