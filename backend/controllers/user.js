const bcryptjs = require("bcryptjs");
const db = require("../db.config");
const User = db.User;
const Card = db.Card;

const { UserError, NotFoundError } = require("../helpers/errors/customError");
// const { use } = require("../routes/users");

exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      return res.json({ data: users });
    })
    .catch((err) => next(err));
};

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
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
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
      message:
        "User updated, please log out and log in again if you changed your username.",
    });
  } catch (err) {
    next(err);
  }
};

exports.addUserInBin = (req, res, next) => {
  let userId = req.userId;

  User.destroy({ where: { id: userId } })
    .then((_) => {
      return res.status(204).json({ message: "User deleted" });
    })
    .catch((err) => next(err));
};

exports.restoreUserFromBin = (req, res, next) => {
  let userId = req.userId;

  User.restore({ where: { id: userId } })
    .then((_) => {
      return res.status(204).json({ message: "User restored" });
    })
    .catch((err) => next(err));
};

exports.deleteUserPermanently = (req, res, next) => {
  let userId = req.userId;

  try {
    User.destroy({ where: { id: userId }, force: true });
    return res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
