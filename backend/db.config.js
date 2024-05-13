const { Sequelize } = require("sequelize");

let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: "mysql",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: process.env.NODE_ENV === "development" ? console.log : false, // Conditional logging
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const db = {};
db.sequelize = sequelize;
db.User = require("./models/user")(sequelize);
db.Deck = require("./models/deck")(sequelize);
db.Card = require("./models/card")(sequelize);

// Associations
db.User.hasMany(db.Deck, {
  foreignKey: "user_id",
  as: "decks",
  onDelete: "cascade",
});

db.Deck.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

db.Deck.hasMany(db.Card, {
  foreignKey: "deck_id",
  as: "cards",
  onDelete: "cascade",
});

db.Card.belongsTo(db.Deck, {
  foreignKey: "deck_id",
  as: "deck",
});

// Synchronize models with the database
// sequelize.sync({ force: true }).then(() => {
//   console.log("Synchronization of models with the database successful.");
// });

module.exports = db;
