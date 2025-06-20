const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Types;

// Modèles
const Category = require("./models/Category");
const Component = require("./models/Component");
const User = require("./models/User");
const Configuration = require("./models/Configuration");
const Partner = require("./models/Partner");
const Price = require("./models/Price");

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/pc-builder")
  .catch((err) => console.error("Erreur de connexion:", err));

// Fonction pour créer une image placeholder
const createPlaceholderImage = (text, width = 200, height = 200) => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  return Buffer.from(svg);
};

// Données à insérer
const categories = [
  { name: "Processeur" },
  { name: "Carte mère" },
  { name: "Mémoire RAM" },
  { name: "Carte graphique" },
  { name: "Disque dur" },
  { name: "SSD" },
  { name: "Alimentation" },
  { name: "Boîtier" },
  { name: "Ventilateur" },
  { name: "Carte son" },
  { name: "Carte réseau" },
  { name: "Lecteur optique" },
  { name: "Clavier" },
  { name: "Souris" },
  { name: "Écran" },
  { name: "Casque" },
  { name: "Webcam" },
  { name: "Imprimante" },
  { name: "Scanner" },
  { name: "Haut-parleur" },
  { name: "Microphone" },
  { name: "Tablette graphique" },
  { name: "Manette" },
  { name: "Adaptateur USB" },
  { name: "Hub USB" },
  { name: "Câble HDMI" },
  { name: "Adaptateur secteur" },
  { name: "Batterie externe" },
  { name: "Support écran" },
  { name: "Tapis de souris" },
];

const partners = [
  {
    name: "LDLC",
    website: "https://www.ldlc.com",
    description: "Spécialiste informatique depuis 1996",
    isActive: true,
  },
  {
    name: "Amazon",
    website: "https://www.amazon.fr",
    description: "Marketplace mondiale",
    isActive: true,
  },
  {
    name: "Cdiscount",
    website: "https://www.cdiscount.com",
    description: "E-commerce français",
    isActive: true,
  },
  {
    name: "Rue du Commerce",
    website: "https://www.rueducommerce.fr",
    description: "Site e-commerce tech",
    isActive: true,
  },
  {
    name: "Materiel.net",
    website: "https://www.materiel.net",
    description: "Spécialiste hardware",
    isActive: true,
  },
  {
    name: "TopAchat",
    website: "https://www.topachat.com",
    description: "Vente composants PC",
    isActive: true,
  },
  {
    name: "Grosbill",
    website: "https://www.grosbill.com",
    description: "Informatique et multimédia",
    isActive: true,
  },
  {
    name: "FNAC",
    website: "https://www.fnac.com",
    description: "Culture et technologie",
    isActive: true,
  },
  {
    name: "Darty",
    website: "https://www.darty.com",
    description: "Électroménager et tech",
    isActive: true,
  },
  {
    name: "Boulanger",
    website: "https://www.boulanger.com",
    description: "Spécialiste électroménager",
    isActive: true,
  },
];

// Fonction pour générer des utilisateurs
const generateUsers = async () => {
  const users = [
    {
      email: "admin@pcbuilder.com",
      password: await bcrypt.hash("admin123", 10),
      name: "Admin Principal",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "john.doe@example.com",
      password: await bcrypt.hash("password123", 10),
      name: "John Doe",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Ajouter d'autres utilisateurs si nécessaire
  for (let i = 3; i <= 10; i++) {
    users.push({
      email: `user${i}@example.com`,
      password: await bcrypt.hash(`password${i}`, 10),
      name: `User ${i}`,
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return users;
};

// Fonction pour générer des composants
const generateComponents = (categoryIds) => {
  const components = [];
  const brands = [
    "Intel",
    "AMD",
    "NVIDIA",
    "ASUS",
    "MSI",
    "Gigabyte",
    "Corsair",
    "G.Skill",
    "Samsung",
    "Western Digital",
  ];
  const componentNames = [
    "Core i9-13900K",
    "Ryzen 9 7950X",
    "RTX 4090",
    "RTX 4080",
    "RX 7900 XTX",
    "B650 Gaming",
    "Z790 Extreme",
    "DDR5-6000 32GB",
    "DDR4-3200 16GB",
    "NVMe 1TB",
  ];

  for (let i = 0; i < 20; i++) {
    const randomCategory =
      categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomName =
      componentNames[Math.floor(Math.random() * componentNames.length)];
    const componentFullName = `${randomBrand} ${randomName}`;

    components.push({
      name: componentFullName,
      category: randomCategory,
      brand: randomBrand,
      specs: {
        Modèle: `Model-${i + 1}`,
        Série: `Serie-${Math.floor(Math.random() * 10) + 1}`,
        Garantie: `${Math.floor(Math.random() * 3) + 1} ans`,
        Couleur: ["Noir", "Blanc", "RGB", "Argent"][
          Math.floor(Math.random() * 4)
        ],
      },
      image: {
        data: createPlaceholderImage(
          componentFullName.substring(0, 20),
          300,
          200
        ),
        contentType: "image/svg+xml",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return components;
};

// Fonction pour générer des configurations
const generateConfigurations = (userIds, componentIds) => {
  const configurations = [];
  const configNames = ["Gaming Beast", "Workstation Pro", "Budget Build"];

  for (let i = 1; i <= 10; i++) {
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
    const randomName =
      configNames[Math.floor(Math.random() * configNames.length)];
    const randomComponents = [];

    const numComponents = Math.floor(Math.random() * 4) + 3;
    for (let j = 0; j < numComponents; j++) {
      const randomComponent =
        componentIds[Math.floor(Math.random() * componentIds.length)];
      if (!randomComponents.includes(randomComponent)) {
        randomComponents.push(randomComponent);
      }
    }

    configurations.push({
      user: randomUser,
      name: `${randomName} ${i}`,
      components: randomComponents,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      ),
      updatedAt: new Date(),
    });
  }
  return configurations;
};

// Fonction pour générer des prix
const generatePrices = (partnerIds, componentIds) => {
  const prices = [];
  const usedCombinations = new Set();

  while (prices.length < 50) {
    const randomPartner =
      partnerIds[Math.floor(Math.random() * partnerIds.length)];
    const randomComponent =
      componentIds[Math.floor(Math.random() * componentIds.length)];
    const combination = `${randomPartner}-${randomComponent}`;

    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination);
      prices.push({
        partner: randomPartner,
        component: randomComponent,
        price: Math.round((Math.random() * 2000 + 50) * 100) / 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  return prices;
};

// Fonction principale de seed
const seedDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();

    // 1. Insérer les catégories
    const createdCategories = await Category.insertMany(categories);

    // 2. Insérer les partenaires (avec images)
    const partnersWithImages = partners.map((partner) => ({
      ...partner,
      image: {
        data: createPlaceholderImage(partner.name.substring(0, 20), 300, 200),
        contentType: "image/svg+xml",
      },
    }));
    const createdPartners = await Partner.insertMany(partnersWithImages);

    // 3. Générer et insérer les utilisateurs
    const users = await generateUsers();
    const createdUsers = await User.insertMany(users);

    // 4. Générer et insérer les composants
    const categoryIds = createdCategories.map((cat) => cat._id);
    const components = generateComponents(categoryIds);
    const createdComponents = await Component.insertMany(components);

    // 5. Générer et insérer les configurations
    const userIds = createdUsers.map((user) => user._id);
    const componentIds = createdComponents.map((comp) => comp._id);
    const configurations = generateConfigurations(userIds, componentIds);
    const createdConfigurations = await Configuration.insertMany(
      configurations
    );

    // 6. Générer et insérer les prix
    const partnerIds = createdPartners.map((partner) => partner._id);
    const prices = generatePrices(partnerIds, componentIds);
    await Price.insertMany(prices);

    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seed:", error);
    process.exit(1);
  }
};

// Exécuter le seeding
seedDatabase();
