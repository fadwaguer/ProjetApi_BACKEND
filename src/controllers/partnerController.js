const Partner = require('../models/Partner');
const Component = require('../models/Component');

// Lister les prix pour tous les composants
const getPricesForAllComponents = async (req, res) => {
  try {
    const components = await Component.find().populate('category');
    const data = await Promise.all(
      components.map(async (component) => {
        const prices = await Partner.find({ 'componentPrices.component': component._id }, { 'componentPrices.$': 1, name: 1 });
        return {
          component: component.name,
          prices: prices.map((partner) => ({
            partner: partner.name,
            price: partner.componentPrices[0].price,
          })),
        };
      })
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des prix', error });
  }
};

// Calculer le coût total de la configuration
const calculateTotalCost = async (req, res) => {
  try {
    const { componentIds } = req.body;
    const components = await Promise.all(
      componentIds.map(async (id) => {
        const partner = await Partner.findOne({ 'componentPrices.component': id }, { 'componentPrices.$': 1 });
        return partner ? partner.componentPrices[0].price : 0;
      })
    );
    const totalCost = components.reduce((acc, price) => acc + price, 0);
    res.status(200).json({ totalCost });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul du coût total', error });
  }
};

// Ajouter un partenaire
const addPartner = async (req, res) => {
  // Implémentation existante
};

// Mettre à jour un partenaire
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPartner = await Partner.findByIdAndUpdate(id, req.body, { new: true });
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
  // Implémentation existante
};

// Mettre à jour un prix pour un composant
const updatePriceForComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const partner = await Partner.findOne({ 'componentPrices._id': id });
    if (!partner) return res.status(404).json({ message: 'Prix non trouvé' });
    const priceEntry = partner.componentPrices.id(id);
    priceEntry.price = price;
    await partner.save();
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du prix', error });
  }
};

// Supprimer un prix pour un composant
const deletePriceForComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findOne({ 'componentPrices._id': id });
    if (!partner) return res.status(404).json({ message: 'Prix non trouvé' });
    partner.componentPrices.id(id).remove();
    await partner.save();
    res.status(200).json({ message: 'Prix supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du prix', error });
  }
};

module.exports = {
  getPricesForAllComponents,
  calculateTotalCost,
  addPartner,
  updatePartner,
  deletePartner,
  addPriceForComponent,
  updatePriceForComponent,
  deletePriceForComponent,
};
