const Category = require('../models/Category');
const Component = require('../models/Component');

// Lister les catégories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error });
  }
};

// Ajouter une catégorie
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'La catégorie existe déjà' });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la catégorie', error });
  }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // Vérification si la catégorie à mettre à jour existe
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    // Vérifier si une autre catégorie avec le nom mis à jour existe déjà
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }

    // Mise à jour de la catégorie
    category.name = name || category.name;
    await category.save();

    res.status(200).json({ message: 'Catégorie mise à jour avec succès', category });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error });
  }
};


// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si des composants sont associés à cette catégorie
    const associatedComponents = await Component.findOne({ category: id });
    if (associatedComponents) {
      return res.status(400).json({ message: 'Impossible de supprimer la catégorie. Des composants y sont associés.' });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error });
  }
};


module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
