import { useContext, useEffect, useState, createContext } from "react";
import { api } from "../services/api";
import { limparBarbershopSlug } from "../utils/barbershopSlug.js";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    // Inicialização otimista: lê do localStorage logo na primeira renderização
    const savedData = localStorage.getItem("barbearia:userData");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        localStorage.removeItem("barbearia:userData");
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const putUserData = (data) => {
    setUserInfo(data);

    const safeData = {
      id: data.id,
      name: data.name,
      email: data.email,
      client_phone: data.client_phone,
      admin: data.admin,
      role: data.role,
      privacy_accepted_at: data.privacy_accepted_at,
    };
    localStorage.setItem("barbearia:userData", JSON.stringify(safeData));
  };

  const acceptPrivacyPolicy = async () => {
    try {
      await api.put("/me/accept-privacy", {}); // Rota do PrivacyController

      const updatedData = {
        ...userInfo,
        privacy_accepted_at: new Date().toISOString(),
      };

      putUserData(updatedData);
      return true;
    } catch (error) {
      console.error("Erro ao aceitar política de privacidade:");
      throw error;
    }
  };

  const logout = async () => {
    setUserInfo(null);
    localStorage.removeItem("barbearia:userData");
    limparBarbershopSlug();

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Erro ao avisar o servidor sobre o logout:");
    }
  };

  useEffect(() => {
    async function carregarEValidarSessao() {
      // Se estiver em uma página do SuperAdmin, ignora a validação de cliente comum
      if (window.location.pathname.startsWith("/super")) {
        setLoading(false);
        return;
      }

      const userInfoLocalStorage = localStorage.getItem("barbearia:userData");

      if (!userInfoLocalStorage) {
        setLoading(false);
        return;
      }

      try {
        // Tenta validar a sessão real com o backend através dos cookies
        const response = await api.get("/me");
        putUserData(response.data);
      } catch (error) {
        console.warn("Falha ao validar sessão com o servidor:");

        // Só desloga se o servidor retornar explicitamente que o token expirou ou é inválido (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Sessão inválida ou expirada. Removendo credenciais.");
          setUserInfo(null);
          localStorage.removeItem("barbearia:userData");
        } else {
          // Se for erro de rede ou instabilidade momentânea, mantém o usuário logado com o cache local
          console.warn(
            "Mantendo dados locais devido a erro temporário de conexão.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    carregarEValidarSessao();
  }, []);

  // Helper booleano para verificar facilidades nas rotas e telas
  const hasAcceptedPrivacy = Boolean(userInfo?.privacy_accepted_at);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        putUserData,
        acceptPrivacyPolicy,
        hasAcceptedPrivacy,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be a valid context");
  }
  return context;
};
