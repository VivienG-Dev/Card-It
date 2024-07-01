// Using mergeParams to access :username from parent router (the route is /users/:username/decks)
const router = require("express").Router({ mergeParams: true });
const deckController = require("../controllers/deck");
const validateUsernameMiddleware = require("../middlewares/validateUsername");
const validations = require("../middlewares/validation");
const handleValidationErrors = require("../helpers/errors/validationErrorHandler");

router.get("/", validateUsernameMiddleware, deckController.getAllDecks);

router.get("/:deckId", validateUsernameMiddleware, deckController.getOneDeck);

router.patch(
  "/:deckId",
  validateUsernameMiddleware,
  validations.deck.update,
  handleValidationErrors,
  deckController.updateDeck
);

router.patch("/:deckId/generate-share-link", validateUsernameMiddleware, deckController.generateShareLink);

router.put("/", validateUsernameMiddleware, validations.deck.create, handleValidationErrors, deckController.createDeck);

router.put(
  "/accept-share/",
  validateUsernameMiddleware,
  validations.deck.acceptSharedDeck,
  handleValidationErrors,
  deckController.acceptSharedDeck
);

router.delete("/:deckId", validateUsernameMiddleware, deckController.deleteDeck);

module.exports = router;
