const router = require("express").Router();
const { getFavorites, updateFavorites } = require("../controllers/favoriteController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/favorites", authMiddleware, getFavorites);
router.post("/favorites", authMiddleware, updateFavorites);

module.exports = router;
