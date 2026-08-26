import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import { obterBarbershopSlug } from "../utils/barbershopSlug";
import { AceitarPolitica } from "../containers/AceitarPolitica";

//Monta o caminho de volta ao login, respeitando de qual barbearia o usuário veio
function caminhoDeLogin() {
  const slug = obterBarbershopSlug();
  return slug ? `/${slug}/login` : "/";
}

// 1. ROTA PROTEGIDA GLOBAL (Para qualquer usuário autenticado)
export function ProtectedRoute({ children }) {
  const { userInfo } = useUser();
  const navigate = useNavigate();

  // Se não há usuário logado, mostra um aviso visual na tela em vez de redirecionar bruto
  if (!userInfo) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          textAlign: "center",
          padding: "20px",
          color: "#333",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h2 style={{ marginBottom: "15px", fontSize: "22px", color: "#111" }}>
            Acesso Restrito
          </h2>
          <p style={{ marginBottom: "25px", color: "#666", fontSize: "15px" }}>
            Você precisa estar logado para conseguir marcar um horário. Clique
            no botão abaixo para fazer o login.
          </p>
          <button
            onClick={() => navigate(caminhoDeLogin(), { replace: true })}
            style={{
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            Fazer Login (OK)
          </button>
          <button
            onClick={() => navigate("/app", { replace: true })}
            style={{
              backgroundColor: "transparent",
              color: "#666",
              border: "none",
              padding: "8px",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Voltar para a Início
          </button>
        </div>
      </div>
    );
  }

  // Catraca: se ainda não aceitou, mostra o aviso ANTES de qualquer outra tela
  if (!userInfo.privacy_accepted_at) {
    return <AceitarPolitica />;
  }

  return children;
}

// 2. ROTA PROTEGIDA PARA FUNCIONÁRIOS
export function ProtectedEmployeeRoute({ children }) {
  const { userInfo } = useUser();

  const isEmployee = userInfo?.admin === true || userInfo?.role === "barber";

  if (!isEmployee) {
    return <Navigate to="/app" replace />;
  }

  // Adicionado para evitar que o funcionário acesse sem aceitar a política
  if (!userInfo.privacy_accepted_at) {
    return <AceitarPolitica />;
  }

  return children;
}
// 3. ROTA PROTEGIDA PARA Admin
export function ProtectedEmployeeRouteAdmin({ children }) {
  const { userInfo } = useUser();

  const isEmployee = userInfo?.admin === true;

  if (!isEmployee) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
