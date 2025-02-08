const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'CraftMyPlate API', 
      version: '1.0.0',
      description: 'API documentation for CraftMyPlate',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at: http://localhost:5000/api-docs');
}

module.exports = setupSwagger;
