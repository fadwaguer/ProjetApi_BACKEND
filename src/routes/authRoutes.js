const express = require('express');
const { registerUser, login } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: "Inscription d'un utilisateur"
 *     description: "Permet d'inscrire un nouvel utilisateur."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom de l'utilisateur"
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: "Email de l'utilisateur"
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: "Mot de passe de l'utilisateur"
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: "Utilisateur créé avec succès"
 *       400:
 *         description: "L'utilisateur existe déjà"
 *       500:
 *         description: "Erreur d'inscription"
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: "Connexion d'un utilisateur"
 *     description: "Permet de connecter un utilisateur existant."
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
 *               password:
 *                 type: string
 *                 description: "Mot de passe de l'utilisateur"
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "Connexion réussie, token généré"
 *       400:
 *         description: "Email ou mot de passe incorrect"
 *       500:
 *         description: "Erreur de connexion"
 */
router.post('/login', login);

module.exports = router;
