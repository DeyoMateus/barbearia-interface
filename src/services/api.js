import axios from "axios";
import { obterBarbershopSlug } from "../utils/barbershopSlug.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // Diz ao Axios para anexar os Cookies seguros
  // automaticamente em todas as requisições que fizermos para a API!
  withCredentials: true,
});

// Injeta o slug da barbearia SOMENTE nas rotas públicas (antes do login),
// onde o backend ainda não tem um token JWT para confiar.
// Depois do login, o backend já sabe qual barbearia é através do cookie
// seguro (barbearia_token)

const ROTAS_PUBLICAS = ["/users", "/sessions", "/barbershops"];

api.interceptors.request.use((config) => {
  if (config.url?.startsWith("/super")) {
    return config;
  }

  const ehRotaPublica = ROTAS_PUBLICAS.some((rota) =>
    config.url?.startsWith(rota),
  );
  if (ehRotaPublica) {
    let slug = obterBarbershopSlug();

    // Fallback de segurança: Se não achou no localStorage, tenta tirar da URL (/barbearia-teste/login)
    if (!slug) {
      const pathSegments = window.location.pathname.split("/");
      if (
        pathSegments.length > 1 &&
        pathSegments[1] &&
        pathSegments[1] !== "super"
      ) {
        slug = pathSegments[1];
      }
    }

    if (slug) {
      config.headers["x-barbershop-slug"] = slug;
    }
  }

  return config;
});
