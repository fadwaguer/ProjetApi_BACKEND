const express = require('express');
const { getUsers } = require('../controllers/userController');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Générer la documentation Swagger pour la route de récupération des utilisateurs avec le token d'authentification
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Récupérer les utilisateurs"
 *     description: "Cette route permet de récupérer tous les utilisateurs avec le rôle 'user'."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Liste des utilisateurs"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: "Erreur interne"
 */
router.get('/', protect, adminOnly, getUsers);
module.exports = router;