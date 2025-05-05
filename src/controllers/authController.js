const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription d'un utilisateur
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hacher le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message,
    });
  }
};

// Authentifier l'utilisateur et générer un JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer les tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la connexion',
      error: error.message,
    });
  }
};

module.exports = { registerUser, login };
