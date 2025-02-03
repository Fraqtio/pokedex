import React from "react";

const buttonStyle = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    borderRadius: "5px",
    margin: "0 2px",
    transition: "all 0.2s ease",
};

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPrev,
                        onNext,
                        onPageChange,
                        onLimitChange,
                        isPrevDisabled,
                        isNextDisabled,
                        currentLimit,
                    }) => {
    const generatePageNumbers = () => {
        const pages = new Set();
        pages.add(1);
        pages.add(totalPages);

        for (let i = -2; i <= 2; i++) {
            const page = currentPage + i;
            if (page > 1 && page < totalPages) {
                pages.add(page);
            }
        }

        return [...pages].sort((a, b) => a - b);
    };

    const pages = generatePageNumbers();
    const limitOptions = [10, 20, 50];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginTop: "20px" }}>
            {/* Кнопки выбора количества элементов */}
            <div style={{ display: "flex", gap: "5px" }}>
                {limitOptions.map((option) => (
                    <button
                        key={option}
                        onClick={() => onLimitChange(option)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: option === currentLimit ? "#007bff" : "#fff",
                            color: option === currentLimit ? "#fff" : "#000",
                        }}
                    >
                        {option} per page
                    </button>
                ))}
            </div>

            {/* Основная пагинация */}
            <div style={{ display: "flex", gap: "5px" }}>
                <button
                    onClick={onPrev}
                    disabled={isPrevDisabled}
                    style={{
                        ...buttonStyle,
                        backgroundColor: isPrevDisabled ? "#f0f0f0" : "#fff",
                        cursor: isPrevDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    Prev
                </button>

                {pages.map((page, index) => (
                    <React.Fragment key={page}>
                        {index > 0 && page - pages[index - 1] > 1 && <span style={{ alignSelf: "flex-end" }}>...</span>}
                        <button
                            onClick={() => onPageChange(page)}
                            style={{
                                ...buttonStyle,
                                backgroundColor: page === currentPage ? "#007bff" : "#fff",
                                color: page === currentPage ? "#fff" : "#000",
                            }}
                        >
                            {page}
                        </button>
                    </React.Fragment>
                ))}

                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    style={{
                        ...buttonStyle,
                        backgroundColor: isNextDisabled ? "#f0f0f0" : "#fff",
                        cursor: isNextDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;