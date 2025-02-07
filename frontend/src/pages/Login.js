import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        // Если токен есть в URL
        if (token) {
            // Сохраняем токен
            localStorage.setItem("token", token);

            // Очищаем URL от токена
            navigate("/profile", { replace: true });
        }
        // Если токена нет в URL
        else {
            // Проверяем наличие токена в localStorage
            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                // Если токен есть - перенаправляем в профиль
                navigate("/profile");
            } else {
                // Если токена нет - перенаправляем на главную
                navigate("/");
            }
        }
    }, [location.search, navigate]);

    return null; // Можно вернуть loader вместо null
};

export default Login;