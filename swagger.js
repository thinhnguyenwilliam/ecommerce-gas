// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'User Management API',
        version: '1.0.0',
        description: 'This is a simple API application made with Express and documented with Swagger',
        contact: {
            name: "Your Name",
            url: "https://yourwebsite.com",
            email: "you@example.com"
        },
        license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT"
        }
    },
    servers: [
        {
            url: 'http://localhost:3055',
            description: 'Development server',
        },
    ],
};


const options = {
    swaggerDefinition,
    apis: ['./src/routes/access/*.js','./src/docs/*.js'], // path to your route files, Include your docs folder
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
