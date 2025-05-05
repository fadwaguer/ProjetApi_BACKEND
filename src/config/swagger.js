const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion Matérielle',
      version: '1.0.0',
      description: 'API pour gérer les catégories, composants matériels et partenaires marchands',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant unique de la catégorie',
              example: '60c72b1f4f1a4e1f8c3a9d77',
            },
            name: {
              type: 'string',
              description: 'Nom de la catégorie',
              example: 'CPU',
            },
          },
        },
        Component: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant unique du composant',
              example: '60c72b1f4f1a4e1f8c3a9d78',
            },
            name: {
              type: 'string',
              description: 'Nom du composant',
              example: 'Intel Core i7-12700K',
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
            brand: {
              type: 'string',
              description: 'Marque du composant',
              example: 'Intel',
            },
            specs: {
              type: 'object',
              description: 'Spécifications du composant',
              additionalProperties: true, // Permet d'accepter une structure dynamique pour les spécifications
              example: {
                cores: 12,
                threads: 20,
                frequency: '5.0 GHz',
              },
            },
          },
        },
        Partner: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Identifiant unique du partenaire marchand',
              example: '60c72b1f4f1a4e1f8c3a9d79',
            },
            name: {
              type: 'string',
              description: 'Nom du partenaire marchand',
              example: 'Amazon',
            },
            componentPrices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  component: {
                    $ref: '#/components/schemas/Component',
                  },
                  price: {
                    type: 'number',
                    description: 'Prix du composant proposé par le partenaire',
                    example: 350.99,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
