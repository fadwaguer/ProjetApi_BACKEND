const Partner = require('../models/Partner');
const Component = require('../models/Component');
const Price = require('../models/Price');

// Lister les prix pour tous les composants
const getPricesForAllComponents = async (req, res) => {
  try {
    // Récupérer tous les composants avec leurs catégories
    const components = await Component.find().populate('category');

    // Préparer les données pour chaque composant
    const data = await Promise.all(
      components.map(async (component) => {
        // Récupérer les prix pour ce composant
        const prices = await Price.find({ component: component._id }).populate('partner');

        return {
          component: component.name,
          category: component.category ? component.category.name : null,
          prices: prices.map((priceEntry) => ({
            partner: priceEntry.partner.name,
            price: priceEntry.price,
          })),
        };
      })
    );

    // Retourner les données
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des prix',
      error: error.message,
    });
  }
};

// Récupérer les prix d'un composant
const listPricesByComponent = async (req, res) => {
  try {
    const { componentId } = req.params;

    // Vérifier si l'ID du composant est fourni
    if (!componentId) {
      return res.status(400).json({ message: "L'ID du composant est requis." });
    }

    // Trouver le composant et peupler sa catégorie
    const component = await Component.findById(componentId).populate('category');
    if (!component) {
      return res.status(404).json({ message: "Composant non trouvé." });
    }

    // Récupérer les prix associés à ce composant
    const prices = await Price.find({ component: componentId }).populate('partner');

    const data = prices.map((price) => ({
        partner: price.partner.name,
        price: price.price,
      }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des prix du composant',
      error: error.message,
    });
  }
};

// Calculer le coût total de la configuration
const calculateTotalCost = async (req, res) => {
  try {
    const { componentIds } = req.body;
    if (!componentIds || !Array.isArray(componentIds) || componentIds.length === 0) {
      return res.status(400).json({ message: 'Liste des composants manquante ou invalide.' });
    }

    let totalCost = 0;

    // Calculer le coût total en cherchant le prix minimum de chaque composant
    for (const componentId of componentIds) {
      const component = await Component.findById(componentId);
      if (!component) {
        return res.status(404).json({ message: `Composant avec l'ID ${componentId} non trouvé.` });
      }

      // Trouver le prix minimum pour ce composant parmi tous les partenaires
      const minPrice = await Price.aggregate([
        { $match: { component: component._id } }, // Filtrer par composant
        { $sort: { price: 1 } }, // Trier par prix croissant
        { $limit: 1 } // Récupérer uniquement le prix minimum
      ]);

      if (minPrice.length > 0) {
        totalCost += minPrice[0].price; // Ajouter le prix minimum du composant au coût total
      } else {
        return res.status(404).json({ message: `Aucun prix trouvé pour le composant ${component.name}.` });
      }
    }

    // Retourner le coût total calculé
    res.status(200).json({ totalCost });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul du coût total.', error: error.message });
  }
};

// Récupérer la liste des partenaires
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();

    const data = partners.map(partner => ({
      id: partner._id,
      name: partner.name,
      image: partner.image
        ? `data:${partner.image.contentType};base64,${partner.image.data.toString('base64')}`
        : null, // Retourner null si aucune image n'est disponible
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des partenaires', error: error.message });
  }
};

// Ajouter un partenaire
const addPartner = async (req, res) => {
  try {
    const { name } = req.body;

    // Vérifier si le nom est fourni
    if (!name) {
      return res.status(400).json({ message: 'Le champ name est requis.' });
    }

    // Vérifier si le partenaire existe déjà (par nom)
    const existingPartner = await Partner.findOne({ name });
    if (existingPartner) {
      return res.status(400).json({ message: 'Un partenaire avec ce nom existe déjà.' });
    }

    // Construire les données de l'image si elle est incluse
    let image = null;
    if (req.file) {
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Créer un nouveau partenaire
    const newPartner = new Partner({ name, image });
    await newPartner.save();

    res.status(201).json({ message: 'Partenaire ajouté avec succès.', partner: newPartner });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de l\'ajout du partenaire.',
      error: error.message,
    });
  }
};

// Mettre à jour un partenaire
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      {
        name,
        image: image
          ? {
              data: image.data || null,
              contentType: image.contentType || null,
            }
          : undefined,
      },
      { new: true }
    );

    if (!updatedPartner) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du partenaire', error });
  }
};

// Supprimer un partenaire
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPartner = await Partner.findByIdAndDelete(id);
    if (!deletedPartner) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.status(200).json({ message: 'Partenaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du partenaire', error });
  }
};

// Ajouter un prix pour un composant
const addPriceForComponent = async (req, res) => {
  try {
    const { partnerId, componentId, price } = req.body;

    // Validation des entrées
    if (!partnerId || !componentId || price == null) {
      return res.status(400).json({ message: "Le partenaire, le composant et le prix sont requis." });
    }

    // Vérifier si le partenaire existe
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé." });
    }

    // Vérifier si le composant existe
    const componentExists = await Component.exists({ _id: componentId });
    if (!componentExists) {
      return res.status(404).json({ message: "Composant non trouvé." });
    }

    // Vérifier si un prix existe déjà pour ce composant et ce partenaire
    const existingPrice = await Price.findOne({ partner: partnerId, component: componentId });
    if (existingPrice) {
      return res.status(400).json({ message: "Un prix existe déjà pour ce composant et ce partenaire." });
    }

    // Créer un nouveau prix
    const newPrice = new Price({
      partner: partnerId,
      component: componentId,
      price,
    });

    // Sauvegarder le nouveau prix
    await newPrice.save();

    res.status(201).json({
      message: "Prix ajouté avec succès.",
      newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du prix.", error: error.message });
  }
};

// Mettre à jour le prix d'un composant
const updatePriceForComponent = async (req, res) => {
  try {
    const { partnerId, componentId, price } = req.body;

    // Validation des données d'entrée
    if (!partnerId || !componentId || price == null) {
      return res.status(400).json({ message: "Le partenaire, le composant et le nouveau prix sont requis." });
    }

    // Vérifier si le partenaire existe
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé." });
    }

    // Vérifier si un prix existe pour ce partenaire et ce composant
    const priceEntry = await Price.findOne({ partner: partnerId, component: componentId });
    if (!priceEntry) {
      return res.status(404).json({ message: "Prix pour ce composant et ce partenaire non trouvé." });
    }

    // Mettre à jour le prix
    priceEntry.price = price;
    await priceEntry.save();

    res.status(200).json({
      message: "Prix mis à jour avec succès.",
      priceEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du prix.", error: error.message });
  }
};

// Supprimer le prix d'un composant
const deletePriceForComponent = async (req, res) => {
  try {
    const { partnerId, componentId } = req.body;

    // Valider les données d'entrée
    if (!partnerId || !componentId) {
      return res.status(400).json({ message: "Le partenaire et le composant sont requis." });
    }

    // Vérifier si le partenaire existe
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé." });
    }

    // Supprimer le prix du composant pour le partenaire
    const priceEntry = await Price.findOneAndDelete({ partner: partnerId, component: componentId });

    // Vérifier si un prix a été trouvé et supprimé
    if (!priceEntry) {
      return res.status(404).json({ message: "Prix pour ce composant et ce partenaire non trouvé." });
    }

    res.status(200).json({
      message: "Prix supprimé avec succès.",
      deletedPrice: priceEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression du prix.", error: error.message });
  }
};

module.exports = {
  getPricesForAllComponents,
  listPricesByComponent,
  calculateTotalCost,
  getAllPartners,
  addPartner,
  updatePartner,
  deletePartner,
  addPriceForComponent,
  updatePriceForComponent,
  deletePriceForComponent,
};
