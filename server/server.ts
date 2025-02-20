import dotenv from "dotenv";
dotenv.config();
import { setupRelations } from "./models";
import sequelize from "./config/database";

// import defineEnvVariables from "./middlewares/defineEnvVariables";
// defineEnvVariables();

import app from "./app";

const port = process.env.PORT || 3080;

const connectDB = async () => {
  setupRelations();
  try {
    // Test la connexion à la base de données
    await sequelize.authenticate();
    console.log("MySQL en cours de connexion...");

    // Synchronisation des modèles avec la base de données
    await sequelize.sync();
    // await sequelize.sync({ alter: true }); // update le model
    // await sequelize.sync({ force: true }); // Force recréer tables

    console.log("BDD synchronisé !");
  } catch (err) {
    console.error("Connexion à la BDD impossible:", err);
    process.exit(1);
  }
};

connectDB();

// Lance le serveur
const server = app.listen(port, () => {
  console.log(
    `Application sur le port ${port} en environnement de ${process.env.NODE_ENV}.`
  );
});

// Gestion des erreurs globales
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err);
  server.close(() => {
    process.exit(1);
  });
});
