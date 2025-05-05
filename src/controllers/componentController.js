const Component = require('../models/Component');
const Category = require('../models/Category');

// Lister les composants par catégorie
const getComponentsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    const components = await Component.find({ category: categoryId }).populate('category');
    if (components.length === 0) {
      return res.status(404).json({ message: 'Aucun composant trouvé dans cette catégorie.' });
    }
    res.status(200).json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des composants.', error: error.message });
  }
};

// Détail d'un composant
const getComponentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await Component.findById(id).populate('category');
    if (!component) {
      return res.status(404).json({ message: 'Composant inexistant' });
    }
    res.status(200).json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des détails du composant.', error: error.message });
  }
};

// Ajouter un composant
const addComponent = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Le nom et la catégorie du composant sont requis.' });
    }

    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      return res.status(400).json({ message: 'La catégorie spécifiée n\'existe pas.' });
    }

    const existingComponent = await Component.findOne({ name, category });
    if (existingComponent) {
      return res.status(400).json({ message: 'Le composant existe déjà dans cette catégorie.' });
    }

    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du composant.', error: error.message });
  }
};

// Mettre à jour un composant
const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const component = await Component.findById(id);
    if (!component) {
      return res.status(404).json({ message: 'Composant non trouvé.' });
    }

    if (category) {
      const categoryExists = await Category.exists({ _id: category });
      if (!categoryExists) {
        return res.status(400).json({ message: 'La catégorie spécifiée n\'existe pas.' });
      }
    }

    const updatedComponent = await Component.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du composant.', error: error.message });
  }
};

// Supprimer un composant
const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComponent = await Component.findByIdAndDelete(id);
    if (!deletedComponent) {
      return res.status(404).json({ message: 'Composant non trouvé.' });
    }
    res.status(200).json({ message: 'Composant supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du composant.', error: error.message });
  }
};

module.exports = {
  getComponentsByCategory,
  getComponentDetails,
  addComponent,
  updateComponent,
  deleteComponent,
};
