const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// const { Sequelize } = require("sequelize");

// Database configuration
const db = require("./db.config");

// Express app
const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.APP_URL,
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to check token
const checkTokenMiddleware = require("./middlewares/checkToken");

// Helpers
const errorHandler = require("./helpers/errors/errorHandler");

// Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const decksRouter = require("./routes/decks");
const cardsRouter = require("./routes/cards");

// Public routes
app.get("/", (req, res) => res.send("Hello World!!"));
app.use("/auth", authRouter);

// Protected routes
app.use("/users", checkTokenMiddleware, usersRouter);
app.use("/users/:username/decks", checkTokenMiddleware, decksRouter);
app.use(
  "/users/:username/decks/:deckId/cards",
  checkTokenMiddleware,
  cardsRouter
);

// 404 handler
app.use((req, res) => {
  res.status(404).send("This page does not exist");
});

// Error handler
app.use(errorHandler);

// Database authentication
db.sequelize
  .authenticate()
  .then(() => console.log("Connexion à la base de données réussie."))
  .catch((error) =>
    console.log("Connexion à la base de données échouée.", error)
  );

// Optional: Hard reset of the database (drop all tables and recreate them)
// db.sequelize
//   .sync({ force: true })
//   .then(() =>
//     console.log("All tables were dropped and recreated successfully.")
//   )
//   .catch((error) => console.log("An error occurred:", error));

// module.exports = serverless(app);

const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`Example app listening at ${process.env.APP_URL}`)
);
