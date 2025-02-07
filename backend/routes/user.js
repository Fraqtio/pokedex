const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Маршрут работает!" });
});

// Получить избранные покемоны
router.get('/favourites', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.favourites);
});

// Добавить/удалить избранного покемона
router.post('/favourites', authMiddleware, async (req, res) => {
    const { pokemon } = req.body;
    const user = await User.findById(req.user.id);

    if (user.favourites.includes(pokemon)) {
        user.favourites = user.favourites.filter(fav => fav !== pokemon);
    } else {
        user.favourites.push(pokemon);
    }

    await user.save();
    res.json(user.favourites);
});

module.exports = router;