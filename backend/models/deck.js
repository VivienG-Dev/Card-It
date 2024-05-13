const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Deck = sequelize.define(
    "Deck",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: "#dbeafe",
        validate: {
          is: /^#([0-9A-F]{3}){1,2}$/i,
        },
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      shareToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      shareTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true, // Soft delete
    }
  ));
};

// Syncronisation du modèle avec la base de données
// Deck.sync();
// Deck.sync({ force: true }).then(() => {
//   console.log("Synchronisation des modèles avec la base de données réussie.");
// });
// Deck.sync({ alter: true }).then(() => {
//   console.log("Synchronisation des modèles avec la base de données réussie.");
// });
