import React, { useState } from "react";
import { AdminGerenciamento } from "./Adminmenu/AdminGerenciamento.jsx";
import { ListagemAdmin } from "./lista/ListagemAdmin.jsx";

export function AdminHub() {
  const [aba, setAba] = useState("gestao");

  // Estilo base do botão
  const buttonStyle = (isActive) => ({
    padding: "12px 24px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    border: isActive ? "none" : "1px solid #c9a84c",
    background: isActive ? "#c9a84c" : "transparent",
    color: isActive ? "#111" : "#c9a84c",
    transition: "0.3s",
    fontSize: "14px",
    marginRight: "10px"
  });

  return (
    <div style={{ padding: "40px", background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ color: "#c9a84c", textAlign: "center", marginBottom: "30px" }}>
        Painel Administrativo
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <button 
          onClick={() => setAba("gestao")} 
          style={buttonStyle(aba === "gestao")}
        >
          Gerenciar Cadastros
        </button>
        <button 
          onClick={() => setAba("listagem")} 
          style={buttonStyle(aba === "listagem")}
        >
          Listagem
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {aba === "gestao" ? <AdminGerenciamento /> : <ListagemAdmin />}
      </div>
    </div>
  );
}