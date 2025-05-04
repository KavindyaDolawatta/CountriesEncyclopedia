const User = require("../models/User");

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites || []);
  } catch {
    res.status(500).json({ message: "Failed to get favorites" });
  }
};

exports.updateFavorites = async (req, res) => {
  try {
    const { country } = req.body;
    const user = await User.findById(req.user.id);
    const exists = user.favorites.find(c => c.name.common === country.name.common);

    if (exists) {
      user.favorites = user.favorites.filter(c => c.name.common !== country.name.common);
    } else {
      user.favorites.push(country);
    }

    await user.save();
    res.json(user.favorites);
  } catch {
    res.status(500).json({ message: "Failed to update favorites" });
  }
};
