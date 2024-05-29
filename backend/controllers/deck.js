const db = require("../db.config");
const User = db.User;
const Deck = db.Deck;
const Card = db.Card;

const {
  UserError,
  NotFoundError,
  RequestError,
} = require("../helpers/errors/customError");

exports.getAllDecks = async (req, res, next) => {
  let userId = req.userId;

  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.emailVerified) {
      throw new RequestError("Email verification is required to access decks.");
    }

    let decks = await Deck.findAll({
      where: { user_id: userId },
      attributes: ["id", "title", "color"],
    });
    return res.json({ data: decks });
  } catch (err) {
    next(err);
  }
};

exports.getOneDeck = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;

  try {
    if (!userId || !deckId) {
      throw new UserError("Invalid ID");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let deck = await Deck.findOne({ where: { id: deckId, user_id: userId } });
    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    return res.json({ data: deck });
  } catch (err) {
    next(err);
  }
};

exports.updateDeck = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;
  const { title, color } = req.body;

  try {
    if (!userId || !deckId) {
      throw new UserError("Invalid ID");
    }

    if (!title) {
      throw new RequestError("The title is missing!");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let deck = await Deck.findOne({ where: { id: deckId, user_id: userId } });
    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    deck.title = title;
    deck.color = color;
    if (deck.changed()) {
      await deck.save();

      // Update the title and color of all cards in the deck
      await Card.update(
        { deck_title: title, deck_color: color },
        { where: { deck_id: deckId } }
      );
    } else {
      throw new RequestError("No changes detected");
    }
    return res.json({ message: "Deck updated", data: deck });
  } catch (err) {
    next(err);
  }
};

exports.createDeck = async (req, res, next) => {
  let userId = req.userId;
  const { title, color } = req.body;

  try {
    if (!title) {
      throw new RequestError("The title is missing!");
    }

    const maxLength = 30;
    if (title.length > maxLength) {
      throw new RequestError(
        `The title cannot exceed ${maxLength} characters.`
      );
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new RequestError(
        "Invalid color format. Please use hex format (e.g., #141A1F)."
      );
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let newDeck = await Deck.create({
      user_id: userId,
      title: title,
      color: color,
    });
    return res.status(201).json({ message: "Deck created", data: newDeck });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.generateShareLink = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;

  try {
    if (!deckId) {
      throw new UserError("Invalid deck ID");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Generate a unique token
    const { v4: uuidv4 } = require("uuid");
    const shareToken = uuidv4(); // Generates a unique UUID

    // Set token expiration time (e.g., 24 hours from now)
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const expirationDate = new Date(Date.now() + expiresIn);

    // Store or update the share token and its expiration in the database
    await Deck.update(
      { shareToken: shareToken, shareTokenExpiresAt: expirationDate },
      { where: { id: deckId, user_id: userId } }
    );

    return res.json({ shareToken: shareToken });
  } catch (err) {
    next(err);
  }
};

exports.acceptSharedDeck = async (req, res, next) => {
  let userId = req.userId; // ID of the user who is copying the deck
  let shareToken = req.params.shareToken;

  try {
    // Validate the share token and find the associated deck
    let originalDeck = await Deck.findOne({
      where: { shareToken: shareToken },
      include: [{ model: Card, as: "cards" }], // Use the alias defined in association
    });

    if (!originalDeck) {
      throw new NotFoundError("Shared deck not found");
    }

    // Check if the share token has expired
    if (originalDeck.shareTokenExpiresAt < Date.now()) {
      throw new RequestError("The share link has expired");
    }

    // Create a new deck for the current user, copying details from the original
    let newDeck = await Deck.create({
      user_id: userId,
      title: originalDeck.title,
      color: originalDeck.color,
    });

    // Check if there are cards to copy
    if (originalDeck.cards && originalDeck.cards.length > 0) {
      // Copy each card from the original deck to the new deck
      let cardPromises = originalDeck.cards.map((card) => {
        return Card.create({
          user_id: userId,
          deck_id: newDeck.id,
          deck_title: newDeck.title,
          deck_color: newDeck.color,
          title: card.title,
          description: card.description,
          is_favorite: false,
          is_public: false,
        });
      });

      // Wait for all cards to be copied
      await Promise.all(cardPromises);
    }

    return res.json({
      message: "Deck copied successfully",
      newDeckId: newDeck.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeck = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;

  try {
    await Deck.destroy({ where: { id: deckId }, force: true });
    return res.status(204).json({ message: "Deck deleted" });
  } catch (err) {
    next(err);
  }
};
