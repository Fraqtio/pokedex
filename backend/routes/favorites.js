const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Подключаем middleware для авторизации
const User = require("../models/UserModel"); // Подключаем модель пользователя

// Добавить покемона в избранное
router.post("/:pokemonName", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.favorites.includes(req.params.pokemonName)) {
            user.favorites.push(req.params.pokemonName);
            await user.save();
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Удалить покемона из избранного
router.delete("/:pokemonName", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(name => name !== req.params.pokemonName);
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Получить список избранных
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;