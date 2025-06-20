const Partner = require("../models/Partner");
const Component = require("../models/Component");
const Price = require("../models/Price");
const mongoose = require("mongoose");

// Récupérer la liste des partenaires
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().lean();

    const data = partners.map((partner) => ({
      id: partner._id,
      name: partner.name,
      website: partner.website,
      description: partner.description,
      isActive: partner.isActive,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
      image:
        partner.image && partner.image.data
          ? `data:${
              partner.image.contentType
            };base64,${partner.image.data.toString("base64")}`
          : null,
      priceCount: 0, // Vous pourrez ajouter ceci plus tard
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des partenaires",
      error: error.message,
    });
  }
};

const getPartnerWithPrices = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).lean();
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }

    const prices = await Price.find({ partner: req.params.id })
      .populate("component", "name category")
      .lean();

    const response = {
      ...partner,
      image:
        partner.image && partner.image.data
          ? `data:${
              partner.image.contentType
            };base64,${partner.image.data.toString("base64")}`
          : null,
      prices,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error,
    });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const addPartner = async (req, res) => {
  try {
    const { name, website, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le champ name est requis." });
    }

    const existingPartner = await Partner.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingPartner) {
      return res
        .status(400)
        .json({ message: "Un partenaire avec ce nom existe déjà." });
    }

    let image = null;
    if (req.file) {
      if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
        return res.status(400).json({
          message:
            "Format d'image non pris en charge. Seuls JPEG et PNG sont autorisés.",
        });
      }
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const newPartner = new Partner({
      name,
      website,
      description,
      isActive: isActive !== undefined ? isActive : true,
      image,
    });

    await newPartner.save();

    res.status(201).json({
      message: "Partenaire ajouté avec succès.",
      partner: newPartner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout du partenaire.",
      error: error.message,
    });
  }
};

// Mettre à jour un partenaire
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, description, isActive } = req.body;

    const existingPartner = await Partner.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: id },
    });

    if (existingPartner) {
      return res
        .status(400)
        .json({ message: "Un partenaire avec ce nom existe déjà." });
    }

    const updateData = {
      name,
      website,
      description,
      isActive,
    };

    if (req.file) {
      if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
        return res.status(400).json({
          message:
            "Format d'image non pris en charge. Seuls JPEG et PNG sont autorisés.",
        });
      }
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedPartner = await Partner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partenaire non trouvé" });
    }

    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du partenaire",
      error,
    });
  }
};

// Supprimer un partenaire
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPartner = await Partner.findByIdAndDelete(id);
    if (!deletedPartner)
      return res.status(404).json({ message: "Partenaire non trouvé" });
    res.status(200).json({ message: "Partenaire supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du partenaire", error });
  }
};

module.exports = {
  getAllPartners,
  addPartner,
  updatePartner,
  deletePartner,
  getPartnerById,
  getPartnerWithPrices,
};
