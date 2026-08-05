import { Navigate } from "react-router-dom";
import { useUser } from "./userContext";
import { obterBarbershopSlug } from "../utils/barbershopSlug";
import { AceitarPolitica } from "../containers/AceitarPolitica";

//Monta o caminho de volta ao login, respeitando de qual barbearia o usuário veio
function caminhoDeLogin(){
    const slug = obterBarbershopSlug();
    return slug ? `/${slug}/login` : "/";
}

// 1. ROTA PROTEGIDA GLOBAL (Para qualquer usuário autenticado)
export function ProtectedRoute({ children }) {
    const { userInfo } = useUser();

    // Se não há usuário logado, barra e manda direto para o Login
    if (!userInfo) {
        return <Navigate to={caminhoDeLogin()} replace />;
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