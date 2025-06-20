const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Component = require("./models/Component");
const User = require("./models/User");
const Configuration = require("./models/Configuration");
const Partner = require("./models/Partner");
const Price = require("./models/Price");

// Fonction pour créer une image placeholder
const createPlaceholderImage = (text, width = 200, height = 200) => {
  // Créer un SVG simple avec du texte
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
    image: {
      data: createPlaceholderImage("LDLC"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Amazon",
    website: "https://www.amazon.fr",
    description: "Marketplace mondiale",
    isActive: true,
    image: {
      data: createPlaceholderImage("Amazon"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Cdiscount",
    website: "https://www.cdiscount.com",
    description: "E-commerce français",
    isActive: true,
    image: {
      data: createPlaceholderImage("Cdiscount"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Rue du Commerce",
    website: "https://www.rueducommerce.fr",
    description: "Site e-commerce tech",
    isActive: true,
    image: {
      data: createPlaceholderImage("RDC"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Materiel.net",
    website: "https://www.materiel.net",
    description: "Spécialiste hardware",
    isActive: true,
    image: {
      data: createPlaceholderImage("Materiel.net"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "TopAchat",
    website: "https://www.topachat.com",
    description: "Vente composants PC",
    isActive: true,
    image: {
      data: createPlaceholderImage("TopAchat"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Grosbill",
    website: "https://www.grosbill.com",
    description: "Informatique et multimédia",
    isActive: true,
    image: {
      data: createPlaceholderImage("Grosbill"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "FNAC",
    website: "https://www.fnac.com",
    description: "Culture et technologie",
    isActive: true,
    image: {
      data: createPlaceholderImage("FNAC"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Darty",
    website: "https://www.darty.com",
    description: "Électroménager et tech",
    isActive: true,
    image: {
      data: createPlaceholderImage("Darty"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Boulanger",
    website: "https://www.boulanger.com",
    description: "Spécialiste électroménager",
    isActive: true,
    image: {
      data: createPlaceholderImage("Boulanger"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "PC21.fr",
    website: "https://www.pc21.fr",
    description: "Assembleur PC",
    isActive: true,
    image: {
      data: createPlaceholderImage("PC21"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Hardware.fr",
    website: "https://www.hardware.fr",
    description: "Communauté hardware",
    isActive: true,
    image: {
      data: createPlaceholderImage("Hardware"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "ConfigoMatic",
    website: "https://www.configomatic.com",
    description: "Configurateur PC",
    isActive: true,
    image: {
      data: createPlaceholderImage("ConfigoMatic"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "PCSpecialist",
    website: "https://www.pcspecialist.fr",
    description: "PC sur mesure",
    isActive: true,
    image: {
      data: createPlaceholderImage("PCSpecialist"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "NZXT BLD",
    website: "https://nzxt.com/fr-FR",
    description: "PC gaming premium",
    isActive: true,
    image: {
      data: createPlaceholderImage("NZXT"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Origin PC",
    website: "https://www.originpc.com",
    description: "PC haute performance",
    isActive: true,
    image: {
      data: createPlaceholderImage("Origin"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Corsair",
    website: "https://www.corsair.com",
    description: "Périphériques gaming",
    isActive: true,
    image: {
      data: createPlaceholderImage("Corsair"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "MSI Store",
    website: "https://fr.msi.com",
    description: "Composants gaming",
    isActive: true,
    image: {
      data: createPlaceholderImage("MSI"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "ASUS Store",
    website: "https://www.asus.com/fr",
    description: "Innovation technologique",
    isActive: true,
    image: {
      data: createPlaceholderImage("ASUS"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "AMD Store",
    website: "https://www.amd.com/fr",
    description: "Processeurs et GPU",
    isActive: true,
    image: {
      data: createPlaceholderImage("AMD"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Intel Store",
    website: "https://www.intel.fr",
    description: "Processeurs Intel",
    isActive: true,
    image: {
      data: createPlaceholderImage("Intel"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "NVIDIA Shop",
    website: "https://www.nvidia.com/fr-fr",
    description: "Cartes graphiques",
    isActive: true,
    image: {
      data: createPlaceholderImage("NVIDIA"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Western Digital",
    website: "https://www.westerndigital.com",
    description: "Solutions stockage",
    isActive: true,
    image: { data: createPlaceholderImage("WD"), contentType: "image/svg+xml" },
  },
  {
    name: "Seagate",
    website: "https://www.seagate.com/fr",
    description: "Disques durs",
    isActive: true,
    image: {
      data: createPlaceholderImage("Seagate"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Samsung Shop",
    website: "https://www.samsung.com/fr",
    description: "Électronique grand public",
    isActive: true,
    image: {
      data: createPlaceholderImage("Samsung"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "LG Electronics",
    website: "https://www.lg.com/fr",
    description: "Écrans et électronique",
    isActive: true,
    image: { data: createPlaceholderImage("LG"), contentType: "image/svg+xml" },
  },
  {
    name: "Dell Direct",
    website: "https://www.dell.com/fr-fr",
    description: "PC et serveurs professionnels",
    isActive: true,
    image: {
      data: createPlaceholderImage("Dell"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "HP Store",
    website: "https://www.hp.com/fr-fr",
    description: "Ordinateurs et imprimantes",
    isActive: true,
    image: { data: createPlaceholderImage("HP"), contentType: "image/svg+xml" },
  },
  {
    name: "Lenovo Shop",
    website: "https://www.lenovo.com/fr/fr",
    description: "ThinkPad et Legion",
    isActive: true,
    image: {
      data: createPlaceholderImage("Lenovo"),
      contentType: "image/svg+xml",
    },
  },
  {
    name: "Acer Store",
    website: "https://www.acer.com/fr-fr",
    description: "PC portables et gaming",
    isActive: true,
    image: {
      data: createPlaceholderImage("Acer"),
      contentType: "image/svg+xml",
    },
  },
];

// Fonction pour générer des utilisateurs
const generateUsers = async () => {
  const users = [];
  const roles = ["admin", "user"];

  for (let i = 1; i <= 35; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);
    users.push({
      email: `user${i}@example.com`,
      password: hashedPassword,
      name: `User ${i}`,
      role: i <= 5 ? "admin" : "user", // 5 admins, le reste users
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
    "SSD 2TB",
    "HDD 4TB",
    "850W Gold",
    "750W Platinum",
    "Mid Tower RGB",
    "Full Tower",
    "AIO 240mm",
    "Air Cooler",
    "Gaming Mechanical",
    "Wireless Mouse",
    '27" 4K',
    '24" 144Hz',
    "Gaming Headset",
    "4K Webcam",
    "Laser Printer",
    "Document Scanner",
    "2.1 Speakers",
    "USB Microphone",
    "Drawing Tablet",
    "Wireless Controller",
    "USB-C Hub",
    "HDMI 2.1 Cable",
  ];

  for (let i = 0; i < 50; i++) {
    const randomCategory =
      categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomName =
      componentNames[Math.floor(Math.random() * componentNames.length)];
    const componentFullName = `${randomBrand} ${randomName} ${i + 1}`;

    components.push({
      name: componentFullName,
      category: randomCategory,
      brand: randomBrand,
      specs: new Map([
        ["Modèle", `Model-${i + 1}`],
        ["Série", `Serie-${Math.floor(Math.random() * 10) + 1}`],
        ["Garantie", `${Math.floor(Math.random() * 3) + 1} ans`],
        [
          "Couleur",
          ["Noir", "Blanc", "RGB", "Argent"][Math.floor(Math.random() * 4)],
        ],
      ]),
      image: {
        data: createPlaceholderImage(
          componentFullName.substring(0, 20),
          300,
          200
        ),
        contentType: "image/svg+xml",
      },
    });
  }
  return components;
};

// Fonction pour générer des configurations
const generateConfigurations = (userIds, componentIds) => {
  const configurations = [];
  const configNames = [
    "Gaming Beast",
    "Workstation Pro",
    "Budget Build",
    "Streaming Setup",
    "Content Creator",
    "Office Computer",
    "Server Build",
    "HTPC Media",
    "Portable Gaming",
    "Development Rig",
    "Design Station",
    "Mining Rig",
  ];

  for (let i = 1; i <= 40; i++) {
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
    const randomName =
      configNames[Math.floor(Math.random() * configNames.length)];
    const randomComponents = [];

    // Ajouter 3-8 composants aléatoires
    const numComponents = Math.floor(Math.random() * 6) + 3;
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
    });
  }
  return configurations;
};

// Fonction pour générer des prix
const generatePrices = (partnerIds, componentIds) => {
  const prices = [];
  const usedCombinations = new Set();

  // Créer au moins 100 prix avec combinaisons uniques
  while (prices.length < 100) {
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
        price: Math.round((Math.random() * 2000 + 50) * 100) / 100, // Prix entre 50€ et 2050€
      });
    }
  }
  return prices;
};

async function seedDatabase() {
  try {
    console.log("🚀 Début du seeding de la base de données...");

    // Connexion à la base de données
    await connectDB();
    console.log("✅ Connexion établie");

    // Nettoyer la base de données
    await mongoose.connection.dropDatabase();
    console.log("🧹 Base de données nettoyée");

    // 1. Insérer les catégories
    console.log("📁 Insertion des catégories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} catégories insérées`);

    // 2. Insérer les partenaires
    console.log("🤝 Insertion des partenaires...");
    const createdPartners = await Partner.insertMany(partners);
    console.log(`✅ ${createdPartners.length} partenaires insérés`);

    // 3. Insérer les utilisateurs
    console.log("👥 Génération et insertion des utilisateurs...");
    const users = await generateUsers();
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} utilisateurs insérés`);

    // 4. Insérer les composants
    console.log("🔧 Génération et insertion des composants...");
    const categoryIds = createdCategories.map((cat) => cat._id);
    const components = generateComponents(categoryIds);
    const createdComponents = await Component.insertMany(components);
    console.log(`✅ ${createdComponents.length} composants insérés`);

    // 5. Insérer les configurations
    console.log("⚙️ Génération et insertion des configurations...");
    const userIds = createdUsers.map((user) => user._id);
    const componentIds = createdComponents.map((comp) => comp._id);
    const configurations = generateConfigurations(userIds, componentIds);
    const createdConfigurations = await Configuration.insertMany(
      configurations
    );
    console.log(`✅ ${createdConfigurations.length} configurations insérées`);

    // 6. Insérer les prix
    console.log("💰 Génération et insertion des prix...");
    const partnerIds = createdPartners.map((partner) => partner._id);
    const prices = generatePrices(partnerIds, componentIds);
    const createdPrices = await Price.insertMany(prices);
    console.log(`✅ ${createdPrices.length} prix insérés`);

    console.log("\n🎉 SEEDING TERMINÉ AVEC SUCCÈS !");
    console.log("📊 Résumé des données insérées :");
    console.log(`   - Catégories: ${createdCategories.length}`);
    console.log(`   - Partenaires: ${createdPartners.length}`);
    console.log(`   - Utilisateurs: ${createdUsers.length}`);
    console.log(`   - Composants: ${createdComponents.length}`);
    console.log(`   - Configurations: ${createdConfigurations.length}`);
    console.log(`   - Prix: ${createdPrices.length}`);
    console.log(
      `   📈 Total: ${
        createdCategories.length +
        createdPartners.length +
        createdUsers.length +
        createdComponents.length +
        createdConfigurations.length +
        createdPrices.length
      } enregistrements`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
}

// Exécuter le seeding
seedDatabase();
