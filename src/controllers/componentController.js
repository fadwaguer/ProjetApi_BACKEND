const Component = require('../models/Component');
const Category = require('../models/Category');
const Price = require('../models/Price');

const getComponentsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log('Category Name:', categoryName);

    // Vérifier si la catégorie existe par son nom
    const categoryExists = await Category.findOne({
      name: { $regex: new RegExp('^' + categoryName + '$', 'i') },
    });
    if (!categoryExists) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }

    // Récupérer les composants dans cette catégorie
    const components = await Component.find({ category: categoryExists._id });

    if (components.length === 0) {
      return res.status(404).json({ message: 'Aucun composant trouvé dans cette catégorie.' });
    }

    // Récupérer les prix associés aux composants
    const componentIds = components.map(component => component._id);
    const prices = await Price.find({ component: { $in: componentIds } }).populate('partner', 'name image');

    // Associer les prix aux composants
    const formattedComponents = components.map(component => {
      const componentPrices = prices
        .filter(price => price.component.toString() === component._id.toString())
        .map(price => ({
          partnerId: price.partner._id,
          partnerName: price.partner.name,
          price: price.price,
        }));

      const image = component.image && component.image.data
        ? `data:${component.image.contentType};base64,${component.image.data.toString('base64')}`
        : null;

      return {
        id: component._id,
        name: component.name,
        category: categoryExists.name,
        brand: component.brand,
        specs: component.specs,
        image: image,
        prices: componentPrices,
      };
    });

    res.status(200).json(formattedComponents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des composants.',
      error: error.message,
    });
  }
};



// Détail d'un composant
const getComponentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le composant et sa catégorie
    const component = await Component.findById(id).populate('category');
    if (!component) {
      return res.status(404).json({ message: 'Composant non trouvé' });
    }

    // Récupérer les prix associés à ce composant
    const prices = await Price.find({ component: id }).populate('partner', 'name image');

    // Formater les prix pour inclure les détails des partenaires
    const formattedPrices = prices.map(price => ({
      partnerId: price.partner._id,
      partnerName: price.partner.name,
      price: price.price,
    }));

    const image = component.image && component.image.data
        ? `data:${component.image.contentType};base64,${component.image.data.toString('base64')}`
        : null;

    res.status(200).json({
      component: {
        id: component._id,
        name: component.name,
        category: component.category,
        brand: component.brand,
        specs: component.specs,
        image: image,
        prices: formattedPrices
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des détails du composant.',
      error: error.message,
    });
  }
};


// Ajouter un composant
const addComponent = async (req, res) => {
  try {
    const { name, category, brand, specs } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Le nom et la catégorie du composant sont requis.' });
    }

    // Vérifier si la catégorie existe par son nom
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({ message: 'La catégorie spécifiée n\'existe pas.' });
    }

    // Vérifier si le composant existe déjà dans cette catégorie
    const existingComponent = await Component.findOne({ name, category: categoryExists._id });
    if (existingComponent) {
      return res.status(400).json({ message: 'Le composant existe déjà dans cette catégorie.' });
    }

    let parsedSpecs = specs;
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs); // Convertir la chaîne en objet
      } catch (error) {
        return res.status(400).json({ message: 'Le format des spécifications est invalide.', error: error.message });
      }
    }

    let image = null;
    if (req.file) {
      if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Format d\'image non pris en charge. Seuls JPEG et PNG sont autorisés.' });
      }
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const component = new Component({
      name,
      category: categoryExists._id,
      brand,
      specs: parsedSpecs,
      image,
    });
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
    const { name, category, brand, specs } = req.body;

    const component = await Component.findById(id);
    if (!component) {
      return res.status(404).json({ message: 'Composant non trouvé.' });
    }

    // Vérifier si la catégorie existe par son nom
    let categoryExists;
    if (category) {
      categoryExists = await Category.findOne({ name: { $regex: new RegExp('^' + category + '$', 'i') } });
      if (!categoryExists) {
        return res.status(400).json({ message: 'La catégorie spécifiée n\'existe pas.' });
      }
    }

    // Vérifier si un autre composant existe déjà avec le même nom dans la catégorie
    if (name || categoryExists) {
      const existingComponent = await Component.findOne({
        name: name || component.name,
        category: categoryExists ? categoryExists._id : component.category,
        _id: { $ne: id }, // Exclure le composant en cours de modification
      });
      if (existingComponent) {
        return res.status(400).json({ message: 'Un composant avec ce nom existe déjà dans cette catégorie.' });
      }
    }

    let parsedSpecs = specs;
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs); // Convertir la chaîne en objet
      } catch (error) {
        return res.status(400).json({ message: 'Le format des spécifications est invalide.', error: error.message });
      }
    }

    // Mise à jour des informations du composant
    component.name = name || component.name;
    component.category = category ? categoryExists._id : component.category;
    component.brand = brand || component.brand;
    component.specs = parsedSpecs || component.specs;

    if (req.file) {
      if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Format d\'image non pris en charge. Seuls JPEG et PNG sont autorisés.' });
      }
      component.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await component.save();
    res.status(200).json(component);
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
