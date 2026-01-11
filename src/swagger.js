import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music Playlists API",
      version: "1.0.0",
      description: "API za upravljanje korisnicima, playlistama i pjesmama",
    },
  },
  apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
