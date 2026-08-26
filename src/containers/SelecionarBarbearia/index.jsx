// src/containers/SelecionarBarbearia/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/userContext.jsx";
import { obterBarbershopSlug } from "../../utils/barbershopSlug.js";
import { C, font } from "../../constants/theme.js";

export function SelecionarBarbearia() {
  const navigate = useNavigate();
  const { userInfo, loading } = useUser();
  const [slugDigitado, setSlugDigitado] = useState("");

  // 🌟 Se já está logado, ou já visitou uma barbearia antes, manda direto pra lá
  useEffect(() => {
    if (loading) return;

    if (userInfo && userInfo.id) {
      navigate("/app", { replace: true });
      return;
    }
    const slugLembrado = obterBarbershopSlug();
    if (slugLembrado) {
      navigate(`/${slugLembrado}/login`, { replace: true });
    }
  }, [userInfo, navigate, loading]);

  function handleSubmit(e) {
    e.preventDefault();
    const slugLimpo = slugDigitado.trim().toLowerCase();
    if (slugLimpo) {
      navigate(`/${slugLimpo}/login`);
    }
    // se vazio, não faz nada — o required no input já evita isso na maioria dos casos
  }

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 360, width: "100%", textAlign: "center" }}
      >
        <h2
          style={{ fontFamily: font.display, color: C.gold, marginBottom: 12 }}
        >
          Bem-vindo(a)
        </h2>
        <p
          style={{
            fontFamily: font.body,
            color: C.muted,
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Digite o nome da barbearia sem espaços para continuar, por exemplo:
          barbeariadojoao, barbearia123, etc.
        </p>
        <input
          type="text"
          required
          placeholder="ex: barbeariadojoao"
          value={slugDigitado}
          onChange={(e) => setSlugDigitado(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text,
            fontFamily: font.body,
            fontSize: 15,
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 8,
            border: "none",
            background: C.gold,
            color: "#1a0e00",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
