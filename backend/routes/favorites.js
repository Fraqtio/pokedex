// Добавить покемона в избранное по имени
router.post("/:pokemonName", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.favorites.includes(req.params.pokemonName)) {
            user.favorites.push(req.params.pokemonName);
            await user.save();
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удалить покемона из избранного по имени
router.delete("/:pokemonName", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(
            (name) => name !== req.params.pokemonName
        );
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получить список избранных (без populate)
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});