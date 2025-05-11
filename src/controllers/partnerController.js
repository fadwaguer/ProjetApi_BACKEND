const Partner = require('../models/Partner');
const Component = require('../models/Component');
const Price = require('../models/Price');

// Récupérer la liste des partenaires
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();

    const data = partners.map(partner => ({
      id: partner._id,
      name: partner.name,
      image: partner.image && partner.image.data
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
    const existingPartner = await Partner.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingPartner) {
      return res.status(400).json({ message: 'Un partenaire avec ce nom existe déjà.' });
    }

    // Construire les données de l'image si elle est incluse
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
    const { name } = req.body;
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
    
    // Vérifier si un partenaire avec le même nom existe
    const existingPartner = await Partner.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id },
    });

    if (existingPartner) {
      return res.status(400).json({ message: 'Un partenaire avec ce nom existe déjà.' });
    }

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

module.exports = {
  getAllPartners,
  addPartner,
  updatePartner,
  deletePartner,
};
