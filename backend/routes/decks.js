// Using mergeParams to access :username from parent router (the route is /users/:username/decks)
const router = require("express").Router({ mergeParams: true });

const deckController = require("../controllers/deck");

const validateUsernameMiddleware = require("../middlewares/validateUsername");

router.get("/", validateUsernameMiddleware, deckController.getAllDecks);

router.get("/:deckId", validateUsernameMiddleware, deckController.getOneDeck);

router.patch("/:deckId", validateUsernameMiddleware, deckController.updateDeck);

router.patch("/:deckId/generate-share-link", validateUsernameMiddleware, deckController.generateShareLink);

router.put("/", validateUsernameMiddleware, deckController.createDeck);

router.put("/accept-share/:shareToken", validateUsernameMiddleware, deckController.acceptSharedDeck);

router.delete("/:deckId", validateUsernameMiddleware, deckController.deleteDeck);

module.exports = router;
