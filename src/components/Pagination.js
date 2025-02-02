import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const pages = new Set(); // Используем Set, чтобы избежать дубликатов

        // Всегда включаем первую и последнюю страницу
        pages.add(1);
        pages.add(totalPages);

        // Добавляем две предыдущие и две следующие страницы
        for (let i = -2; i <= 2; i++) {
            const page = currentPage + i;
            if (page > 1 && page < totalPages) {
                pages.add(page);
            }
        }

        return [...pages].sort((a, b) => a - b); // Сортируем для правильного порядка
    };

    const pages = generatePageNumbers();

    return (
        <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginTop: "20px" }}>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        backgroundColor: page === currentPage ? "#007bff" : "#fff",
                        color: page === currentPage ? "#fff" : "#000",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;