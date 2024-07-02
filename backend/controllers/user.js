const bcryptjs = require("bcryptjs");
const db = require("../db.config");
const User = db.User;
const Card = db.Card;

const { UserError, NotFoundError } = require("../helpers/errors/customError");

exports.getUserById = async (req, res, next) => {
  let userId = req.userId;

  try {
    if (!userId) {
      throw new UserError("Invalid ID");
    }

    let user = await User.findByPk(userId, {
      attributes: ["username", "email"],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.getFavoriteCards = async (req, res, next) => {
  let userId = req.userId;

  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let cards = await Card.findAll({
      where: { is_favorite: true, user_id: userId },
    });
    if (!cards) {
      throw new NotFoundError("Card not found");
    }

    return res.json({ data: cards });
  } catch (err) {
    next(err);
  }
};

exports.updateUserData = async (req, res, next) => {
  let userId = req.userId;
  let { username, password } = req.body;

  username = username.toLowerCase();

  try {
    if (!username && !password) {
      throw new UserError("Username or password are required");
    }

    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.username === "demo" && user.id === "6ac336cf-ba7b-49b0-8aae-a7ba8bd11dfa") {
      throw new UserError("Demo user cannot be updated");
    }

    const hashedPassword = password
      ? await bcryptjs.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))
      : undefined;

    // // await User.update({ username, email, password: hashedPassword }, { where: { id: userId } });
    if (username) user.username = username.toLowerCase();
    if (hashedPassword) user.password = hashedPassword;

    if (user.changed()) {
      await user.save();
    } else {
      throw new RequestError("No changes detected");
    }
    return res.json({
      message: "User updated, please log out and log in again if you changed your username.",
    });
  } catch (err) {
    next(err);
  }
};

exports.addUserInBin = (req, res, next) => {
  let userId = req.userId;

  if (userId === "6ac336cf-ba7b-49b0-8aae-a7ba8bd11dfa") {
    throw new UserError("Demo user cannot be deleted");
  }

  try {
    User.destroy({ where: { id: userId } });
    return res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

exports.restoreUserFromBin = (req, res, next) => {
  let userId = req.userId;

  try {
    User.restore({ where: { id: userId } });
    res.status(204).json({ message: "User restored" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUserPermanently = (req, res, next) => {
  let userId = req.userId;

  if (userId === "6ac336cf-ba7b-49b0-8aae-a7ba8bd11dfa") {
    throw new UserError("Demo user cannot be deleted");
  }

  try {
    User.destroy({ where: { id: userId }, force: true });
    return res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
