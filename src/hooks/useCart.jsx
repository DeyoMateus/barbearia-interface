import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./userContext"; // 🌟 Importamos o contexto do usuário para pegar o ID

const CartContext = createContext({});

export function CartProvider({ children }) {
    const { userInfo } = useUser(); // 🌟 Capturamos o usuário logado
    const [cart, setCart] = useState([]);

    // 🌟 1. EFEITO: Sempre que o usuário logar ou mudar, carregamos o carrinho DELE
    useEffect(() => {
        if (userInfo?.id) {
            // Chave única por usuário: "barbearia:cart:fe6f3617-..."
            const savedCart = localStorage.getItem(`barbearia:cart:${userInfo.id}`);
            setCart(savedCart ? JSON.parse(savedCart) : []);
        } else {
            // Se não houver usuário logado (logout), limpa o estado da memória
            setCart([]);
        }
    }, [userInfo]);

    // 🌟 2. EFEITO: Sempre que o carrinho mudar, salvamos estritamente na chave daquele usuário
    useEffect(() => {
        if (userInfo?.id) {
            localStorage.setItem(`barbearia:cart:${userInfo.id}`, JSON.stringify(cart));
        }
    }, [cart, userInfo]);

    const toggleService = (service) => {
        // Trava de segurança: impede adicionar coisas se o usuário sumir na transição
        if (!userInfo?.id) return;

        setCart((prev) =>
            prev.find((s) => String(s.id) === String(service.id))
                ? prev.filter((s) => String(s.id) !== String(service.id))
                : [...prev, service]
        );
    };

    const clearCart = () => {
        setCart([]);
        if (userInfo?.id) {
            localStorage.removeItem(`barbearia:cart:${userInfo.id}`);
        }
    };

    const onCheckout = () => {
        if (cart.length === 0) {
            console.warn("Carrinho vazio!");
            return false;
        }
        return true;
    };

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    return (
        <CartContext.Provider value={{ cart, toggleService, clearCart, total, onCheckout }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}