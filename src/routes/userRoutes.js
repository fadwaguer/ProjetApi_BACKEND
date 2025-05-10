const express = require('express');
const { getUsers } = require('../controllers/userController');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: API pour gérer les utilisateurs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom complet de l'utilisateur
 *         email:
 *           type: string
 *           description: Adresse e-mail de l'utilisateur
 *         role:
 *           type: string
 *           description: Rôle de l'utilisateur (ex. 'user', 'admin')

 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer les utilisateurs (admin only)
 *     tags: [Utilisateurs]
 *     description: Récupérer tous les utilisateurs ayant le rôle 'user'.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur interne
 */
router.get('/', protect, adminOnly, getUsers);
module.exports = router;