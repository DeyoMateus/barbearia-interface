import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../containers/Login";
import { Register } from "../containers/Register";
import { Home } from "../containers/Home";
import { Header } from "../containers/Header";
import { Servico } from "../containers/Servico";
import { Agendamento } from "../containers/Agendamento";
import { AgendaBarbeiro } from "../containers/AgendaBarbeiro";
import { PainelBarbeiro } from "../containers/PainelBarbeiro";
import { useUser } from "../hooks/userContext";
import {
  ProtectedEmployeeRoute,
  ProtectedRoute,
  ProtectedEmployeeRouteAdmin,
} from "../hooks/rotaprivada";
import { AdminHub } from "../containers/MenuAdmin/AdminHub.jsx";
import { PoliticaPrivacidade } from "../containers/PoliticaPrivacidade/index.jsx";
import { MinhaConta } from "../containers/MinhaConta/index.jsx";
import { obterBarbershopSlug } from "../utils/barbershopSlug.js";
import { SelecionarBarbearia } from "../containers/SelecionarBarbearia";
import { ForgotPassword } from "../containers/ForgotPassword";
import { ResetPassword } from "../containers/ResetPassword/index.jsx";
import { SuperAdminDashboard } from "../containers/super/painel/SuperAdminDashboard.jsx";
import { SuperAdminRegister } from "../containers/super/SuperAdminRegister.jsx";
import { SuperAdminLogin } from "../containers/super/login/Login.jsx";

export const router = createBrowserRouter([
  {
    path: "/super/sessions",
    element: <SuperAdminLogin />,
  },
  {
    path: "/super/setup",
    element: <SuperAdminRegister />,
  },
  {
    path: "/super/dashboard",
    element: <SuperAdminDashboard />,
  },

  {
    path: "/",
    element: <SelecionarBarbearia />,
  },
  {
    path: "/politica-de-privacidade",
    element: <PoliticaPrivacidade />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Header />
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/servico",
    element: (
      <ProtectedRoute>
        <Header />
        <Servico />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/minha-conta",
    element: (
      <ProtectedRoute>
        <Header />
        <MinhaConta />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/agendamento",
    element: (
      <ProtectedRoute>
        <Header />
        <Agendamento />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/agenda",
    element: (
      <ProtectedEmployeeRoute>
        <Header />
        <AgendaBarbeiro />
      </ProtectedEmployeeRoute>
    ),
  },
  {
    path: "/app/painel",
    element: (
      <ProtectedEmployeeRoute>
        <Header />
        <PainelBarbeiro />
      </ProtectedEmployeeRoute>
    ),
  },
  {
    path: "/app/menu",
    element: (
      <ProtectedEmployeeRouteAdmin>
        <Header />
        <AdminHub />
      </ProtectedEmployeeRouteAdmin>
    ),
  },
  // Cada barbearia tem seu próprio "endereço" de login e cadastro
  {
    path: "/:barbershopSlug/login",
    element: <Login />,
  },
  {
    path: "/:barbershopSlug/cadastro",
    element: <Register />,
  },
  {
    path: "/:barbershopSlug/esqueci-senha",
    element: <ForgotPassword />,
  },
  {
    path: "/:barbershopSlug/reset-password",
    element: <ResetPassword />,
  },
  // Depois do login, a navegação NÃO carrega mais o slug na URL —
  // o cookie seguro já identifica a barbearia em todas essas rotas.
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
