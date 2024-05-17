const { Sequelize } = require("sequelize");

const sequelizeConfig = {
  dialect: "postgres",
  dialectModule: require("pg"),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 20000,
    idle: 10000,
  },
};

let sequelize;

function getSequelizeInstance() {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      sequelizeConfig
    );
  }
  return sequelize;
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = getSequelizeInstance();

db.User = require("./models/user")(db.sequelize);
db.Deck = require("./models/deck")(db.sequelize);
db.Card = require("./models/card")(db.sequelize);

db.User.hasMany(db.Deck, {
  foreignKey: "user_id",
  as: "decks",
  onDelete: "cascade",
});
db.Deck.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
db.Deck.hasMany(db.Card, {
  foreignKey: "deck_id",
  as: "cards",
  onDelete: "cascade",
});
db.Card.belongsTo(db.Deck, { foreignKey: "deck_id", as: "deck" });

module.exports = db;
