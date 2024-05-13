// Using mergeParams to access :username from parent router (the route is /users/:username/decks/:deckId/cards)
const router = require("express").Router({ mergeParams: true });

const cardController = require("../controllers/card");

const validateUsernameMiddleware = require("../middlewares/validateUsername");

router.get("/", validateUsernameMiddleware, cardController.getAllCards);

router.get("/:cardId", validateUsernameMiddleware, cardController.getOneCard);

router.put("/", validateUsernameMiddleware, cardController.createCard);

router.patch("/:cardId/favorite", validateUsernameMiddleware, cardController.toggleFavorite);

router.patch("/:cardId", validateUsernameMiddleware, cardController.updateCard);

router.delete("/:cardId", validateUsernameMiddleware, cardController.deleteCard);

module.exports = router;
