const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return (User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        defaultValue: "",
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
        allowNull: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      paranoid: true, // Soft delete
    }
  ));
};

// Syncronisation du modèle avec la base de données
// User.sync();
// User.sync({ force: true }).then(() => {
//   console.log("Synchronisation des modèles avec la base de données réussie.");
// });
// User.sync({alter: true}).then(() => {
//     console.log("Synchronisation des modèles avec la base de données réussie.");
// });
