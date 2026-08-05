import { C, font } from '../../constants/theme.js';
import React from "react";


export function CartButton({ count, total, onClick }) {
    if (count === 0) return null;

    // Estilização local isolada para o botão do carrinho
    const buttonStyle = {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: C?.gold || "#c9a84c",
        color: "#1a0e00",
        border: "none",
        borderRadius: 30,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        cursor: "pointer",
        zIndex: 100,
        width: "calc(100% - 48px)",
        maxWidth: 480,
        transition: "all 0.2s ease",
    };

    const textStyle = {
        fontFamily: font?.body || "sans-serif",
        fontSize: 14,
        fontWeight: 600,
        margin: 0,
    };

    const badgeStyle = {
        background: "rgba(0, 0, 0, 0.15)",
        borderRadius: 8,
        padding: "4px 8px",
        fontSize: 12,
        fontWeight: 700,
    };

    return (
        <button style={buttonStyle} onClick={onClick}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={badgeStyle}>{count}</span>
                <p style={textStyle}>{count === 1 ? "Serviço selecionado" : "Serviços selecionados"}</p>
            </div>
            <p style={{ ...textStyle, fontWeight: 700 }}>
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ➔
            </p>
        </button>
    );
}

export default CartButton;