const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (Card = sequelize.define(
    "Card",
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
      deck_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      deck_color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: "#dbeafe",
        validate: {
          is: /^#([0-9A-F]{3}){1,2}$/i,
        },
      },
      title: {
        type: DataTypes.STRING(30),
        defaultValue: "",
        allowNull: false,
      },
      deck_title: {
        type: DataTypes.STRING(30),
        defaultValue: "",
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      is_favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      paranoid: true, // Soft delete
    }
  ));
};

// Syncronisation du modèle avec la base de données
// Card.sync();
// Card.sync({ force: true }).then(() => {
//   console.log("Synchronisation des modèles avec la base de données réussie.");
// });
// Card.sync({alter: true}).then(() => {
//     console.log("Synchronisation des modèles avec la base de données réussie.");
// });
