const express = require('express');
const User = require('../models/UserModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user); // Теперь отправляем ВСЕ данные пользователя
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Получить избранные покемоны
router.get('/favorites', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
});

router.post("/favorites", authMiddleware, async (req, res) => {
    try {
        const { pokemonName } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.favorites.includes(pokemonName)) {
            user.favorites.push(pokemonName);
            await user.save();
        }

        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/favorites/:pokemonName", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter((name) => name !== req.params.pokemonName);
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;