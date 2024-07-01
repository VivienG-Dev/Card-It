const db = require("../db.config");
const User = db.User;
const Deck = db.Deck;
const Card = db.Card;

const { UserError, NotFoundError, RequestError } = require("../helpers/errors/customError");

exports.getAllCards = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;

  if (!userId) {
    throw new UserError("Invalid ID");
  }

  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let deck = await Deck.findOne({ where: { id: deckId, user_id: userId } });
    if (!deck) {
      throw new NotFoundError("Deck not found");
    }

    let cards = await Card.findAll({ where: { deck_id: deckId } });
    if (!cards) {
      throw new NotFoundError("Card not found");
    }

    return res.json({ data: cards });
  } catch (err) {
    next(err);
  }
};

exports.getOneCard = async (req, res, next) => {
  let userId = req.userId;
  let cardId = req.params.cardId;

  try {
    if (!userId || !cardId) {
      throw new UserError("Invalid ID");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let card = await Card.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundError("Card not found");
    }

    return res.json({ data: card });
  } catch (err) {
    next(err);
  }
};

exports.updateCard = async (req, res, next) => {
  let userId = req.userId;
  let cardId = req.params.cardId;
  let { title, description } = req.body;

  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let card = await Card.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundError("Card not found");
    }

    card.title = card.title === title ? card.title : title;
    card.description = card.description === description ? card.description : description;
    // card.is_public = is_public;

    if (card.changed()) {
      await card.save();
    } else {
      throw new RequestError("No changes detected");
    }

    return res.json({ message: "Card updated", data: card });
  } catch (err) {
    next(err);
  }
};

exports.toggleFavorite = async (req, res, next) => {
  let userId = req.userId;
  let cardId = req.params.cardId;

  try {
    if (!userId || !cardId) {
      throw new UserError("Invalid ID");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let card = await Card.findOne({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundError("Card not found");
    }

    card.is_favorite = !card.is_favorite;

    await card.save();

    return res.json({
      message: `Card ${card.is_favorite ? "added to" : "removed from"} favorites`,
      data: card,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  let userId = req.userId;
  let deckId = req.params.deckId;
  let { title, description } = req.body;

  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const deck = await Deck.findByPk(deckId);
    if (!deck) {
      res.status(404).send({ message: "Deck not found" });
      return;
    }

    let card = await Card.create({
      title: title,
      deck_title: deck.title,
      deck_color: deck.color,
      description: description,
      deck_id: deckId,
      user_id: userId,
    });
    return res.json({ message: "Card added", data: card });
  } catch (err) {
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  let userId = req.userId;
  let cardId = req.params.cardId;

  try {
    await Card.destroy({ where: { id: cardId }, force: true });
    return res.json({ message: "Card deleted" });
  } catch (err) {
    next(err);
  }
};
