const User = require('../models/User');

// Récupérer les utilisateurs avec le role "user"
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

module.exports = {
  getUsers,
};