import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./userContext"; // 🌟 Importamos o contexto do usuário para pegar o ID

const CartContext = createContext({});

// Chave usada para visitantes que ainda não fizeram login.
// Assim o carrinho funciona igual para todo mundo — só muda ONDE é salvo.
const GUEST_CART_KEY = "barbearia:cart:guest";

function getCartKey(userInfo) {
  return userInfo?.id ? `barbearia:cart:${userInfo.id}` : GUEST_CART_KEY;
}

export function CartProvider({ children }) {
  const { userInfo } = useUser(); // 🌟 Capturamos o usuário logado (pode ser null)
  const [cart, setCart] = useState([]);

  // 🌟 1. EFEITO: Carrega o carrinho certo sempre que o usuário mudar
  // (login, logout, ou ainda anônimo — todos têm uma chave válida agora)
  useEffect(() => {
    const key = getCartKey(userInfo);
    const savedCart = localStorage.getItem(key);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [userInfo]);

  // 🌟 2. EFEITO: Sempre que o carrinho mudar, salva na chave correta
  useEffect(() => {
    const key = getCartKey(userInfo);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, userInfo]);

  // 🌟 3. EFEITO: Ao logar, se havia itens salvos como "guest", migra pro
  // carrinho do usuário e limpa a chave de convidado — assim quem monta o
  // carrinho antes de logar não perde a seleção ao autenticar.
  useEffect(() => {
    if (!userInfo?.id) return;

    const guestCartRaw = localStorage.getItem(GUEST_CART_KEY);
    if (!guestCartRaw) return;

    try {
      const guestCart = JSON.parse(guestCartRaw);
      if (Array.isArray(guestCart) && guestCart.length > 0) {
        setCart((prev) => {
          const merged = [...prev];
          guestCart.forEach((service) => {
            if (!merged.find((s) => String(s.id) === String(service.id))) {
              merged.push(service);
            }
          });
          return merged;
        });
      }
    } catch (e) {
      console.warn("Não foi possível migrar o carrinho de convidado:");
    } finally {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.id]);

  const toggleService = (service) => {
    setCart((prev) =>
      prev.find((s) => String(s.id) === String(service.id))
        ? prev.filter((s) => String(s.id) !== String(service.id))
        : [...prev, service],
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey(userInfo));
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
    <CartContext.Provider
      value={{ cart, toggleService, clearCart, total, onCheckout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
