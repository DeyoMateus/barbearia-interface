import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../containers/Login";
import { Register } from "../containers/Register";
import { Home } from "../containers/Home";
import { Header } from "../containers/Header";
import { Servico } from "../containers/Servico";
import { Agendamento } from "../containers/Agendamento";
import { AgendaBarbeiro } from "../containers/AgendaBarbeiro";
import { PainelBarbeiro } from "../containers/PainelBarbeiro";
import {
  ProtectedEmployeeRoute,
  ProtectedRoute,
  ProtectedEmployeeRouteAdmin,
} from "../hooks/rotaprivada";
import { AdminHub } from "../containers/MenuAdmin/AdminHub.jsx";
import { PoliticaPrivacidade } from "../containers/PoliticaPrivacidade/index.jsx";
import { AceitarPolitica } from "../containers/AceitarPolitica";
import { MinhaConta } from "../containers/MinhaConta/index.jsx";
import { SelecionarBarbearia } from "../containers/SelecionarBarbearia";
import { ForgotPassword } from "../containers/ForgotPassword";
import { ResetPassword } from "../containers/ResetPassword/index.jsx";
import { SuperAdminDashboard } from "../containers/super/painel/SuperAdminDashboard.jsx";
import { SuperAdminRegister } from "../containers/super/SuperAdminRegister.jsx";
import { SuperAdminLogin } from "../containers/super/login/Login.jsx";
import { TenantGate } from "../components/TenantGate";

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

  // =========================================================================
  // Rotas SEM slug (usadas depois do login/navegação interna, quando o slug
  // já está salvo no localStorage a partir de uma visita anterior)
  // =========================================================================
  {
    path: "/app",
    element: (
      <>
        <Header />
        <Home />
      </>
    ),
  },
  {
    path: "/app/servico",
    element: (
      <>
        <Header />
        <Servico />
      </>
    ),
  },
  {
    path: "/app/agendamento",
    element: (
      <>
        <Header />
        <Agendamento />
      </>
    ),
  },

  // =========================================================================
  // Rotas COM slug — é isso que vai num link compartilhado com o cliente,
  // ex: https://seusaas.com/barbeariadojoao/app
  // O TenantGate captura o slug da URL e salva no localStorage antes de
  // qualquer chamada à API dos componentes filhos.
  // =========================================================================
  {
    path: "/:barbershopSlug/app",
    element: (
      <TenantGate>
        <Header />
        <Home />
      </TenantGate>
    ),
  },
  {
    path: "/:barbershopSlug/app/servico",
    element: (
      <TenantGate>
        <Header />
        <Servico />
      </TenantGate>
    ),
  },
  {
    path: "/:barbershopSlug/app/agendamento",
    element: (
      <TenantGate>
        <Header />
        <Agendamento />
      </TenantGate>
    ),
  },

  // Rotas que continuam exigindo autenticação
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
  // Rotas de Autenticação por barbearia
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
  {
    path: "/:barbershopSlug/aceitar-politica",
    element: <AceitarPolitica />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
