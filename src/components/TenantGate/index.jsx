// src/components/TenantGate/index.jsx
import { useParams } from "react-router-dom";
import { salvarBarbershopSlug } from "../../utils/barbershopSlug.js";

// Captura o slug da URL (ex: /barbeariadojoao/app) e salva no localStorage
// ANTES dos componentes filhos montarem — assim, quando a Home ou o
// Agendamento disparam suas chamadas à API no primeiro useEffect,
// o obterBarbershopSlug() já retorna o valor certo.
//
// Importante: essa gravação acontece durante o render (não dentro de um
// useEffect) de propósito. Efeitos de filhos rodam ANTES do efeito do pai,
// então se salvássemos aqui dentro de um useEffect, a Home poderia disparar
// sua busca de categorias antes do slug estar salvo — causando o mesmo
// erro 404 "Barbearia não cadastrada" que você via.
export function TenantGate({ children }) {
  const { barbershopSlug } = useParams();

  if (barbershopSlug) {
    salvarBarbershopSlug(barbershopSlug);
  }

  return children;
}
