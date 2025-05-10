const Configuration = require('../models/Configuration');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

const createConfiguration = async (req, res) => {
    try {
      const { email, name, components } = req.body;
  
      if (!email || !name || !components || !Array.isArray(components)) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
      }
  
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      const configuration = new Configuration({
        user: user._id,
        name,
        components,
      });
  
      await configuration.save();
  
      res.status(201).json({
        message: "Configuration créée avec succès",
        configuration,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création de la configuration",
        error: error.message,
      });
    }
  };
  

// Récupérer toutes les configurations d'un utilisateur
const getConfigurationsByUserEmail = async (req, res) => {
    try {
        const { email } = req.params;
  
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
  
        const configurations = await Configuration.find({ user: user._id }).populate('components');
        res.status(200).json(configurations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des configurations.', error });
    }
};

// Récupérer une configuration par ID
const getConfigurationById = async (req, res) => {
    try {
        const { id } = req.params;
  
        const configuration = await Configuration.findById(id).populate('components');
        if (!configuration) {
            return res.status(404).json({ message: 'Configuration introuvable.' });
        }
  
        res.status(200).json(configuration);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la configuration.', error });
    }
};

// Mettre à jour une configuration
const updateConfiguration = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, components } = req.body;
  
        const updatedConfiguration = await Configuration.findByIdAndUpdate(
            id,
            { name, components },
            { new: true }
        ).populate('components');
  
        if (!updatedConfiguration) {
            return res.status(404).json({ message: 'Configuration introuvable.' });
        }
  
        res.status(200).json({ message: 'Configuration mise à jour avec succès.', configuration: updatedConfiguration });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la configuration.', error });
    }
};

// Supprimer une configuration
const deleteConfiguration = async (req, res) => {
    try {
        const { id } = req.params;
  
        const deletedConfiguration = await Configuration.findByIdAndDelete(id);
        if (!deletedConfiguration) {
            return res.status(404).json({ message: 'Configuration introuvable.' });
        }
  
        res.status(200).json({ message: 'Configuration supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la configuration.', error });
    }
};

// Exporter une configuration en PDF
const exportConfigurationToPDF = async (req, res) => {
    try {
      const { id } = req.params;
  
      const configuration = await Configuration.findById(id).populate('components');
      if (!configuration) {
        return res.status(404).json({ message: 'Configuration introuvable.' });
      }
  
      const doc = new PDFDocument();
      const fileName = `configuration-${configuration.name}.pdf`;
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  
      doc.pipe(res);
  
      doc.fontSize(20).text(`Configuration : ${configuration.name}`, { align: 'center' }).moveDown();
  
      doc.fontSize(14).text('Liste des composants :').moveDown();
      configuration.components.forEach((component, index) => {
        doc.text(`${index + 1}. ${component.name} (${component.brand})`);
      });
  
      doc.moveDown().fontSize(12).text(`Exporté le : ${new Date().toLocaleDateString()}`, { align: 'right' });
  
      doc.end();
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'exportation de la configuration en PDF.', error });
    }
  };

// lister les configurations avec les details de l'utilisateur (User)
const getConfigurationsWithUserDetails = async (req, res) => {
    try {
        const configurations = await Configuration.find().populate('user', 'email');
        res.status(200).json(configurations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des configurations avec les détails de l\'utilisateur.', error });
    }
};
  
module.exports = {
    createConfiguration,
    getConfigurationsByUserEmail,
    getConfigurationById,
    updateConfiguration,
    deleteConfiguration,
    exportConfigurationToPDF,
    getConfigurationsWithUserDetails,
};