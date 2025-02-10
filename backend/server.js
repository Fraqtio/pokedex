require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
require('./config/passport');
const cors = require('cors')


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const favoritesRouter = require("./routes/favorites");

const app = express();
app.use(cors({
    origin: [
        process.env.FRONTEND_URL, // Для продакшена
        "http://localhost:3000" // Для локальной разработки
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use("/favorites", favoritesRouter);

const PORT = process.env.VERCEL ? 0 : process.env.PORT || 5000; // Для совместимости с Vercel
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`));