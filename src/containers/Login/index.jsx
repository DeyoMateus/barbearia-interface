import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api.js";
import { useUser } from "../../../hooks/userContext.jsx";

import {
  Container,
  FormCard,
  Title,
  FormGroup,
  Label,
  Input,
  SubmitButton,
} from "./styles";

export function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { putUserData } = useUser();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/super/sessions", { email, password });

      // 1. Pega os dados do usuário e a role corretamente
      const userData = response.data.user;
      const userRole = response.data.role;

      // 2. Corrige a verificação usando 'userRole'
      if (userRole === "super_admin") {
        // Unifica os dados para que o putUserData consiga salvar
        putUserData({
          ...userData,
          role: userRole,
        });

        // 3. Navega para a dashboard do SuperAdmin
        navigate("/super/dashboard");
      } else {
        alert("Acesso negado: Este usuário não é um SuperAdmin.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      const message =
        err.response?.data?.error || "Falha ao conectar com o servidor.";
      alert(`Erro no login: ${message}`);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container>
      <FormCard onSubmit={handleLogin}>
        <Title>Login - SuperAdmin</Title>

        <FormGroup>
          <Label>E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </FormGroup>

        <FormGroup $mb="1.5rem">
          <Label>Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no Painel Mestre"}
        </SubmitButton>
      </FormCard>
    </Container>
  );
}
