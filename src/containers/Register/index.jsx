import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Ajuste o caminho da sua instância do Axios

export function Register() {
  const { barbershopSlug } = useParams();
  const navigate = useNavigate();

  // 1. ESTADOS DO TENANT (BARBEARIA)
  // Declaração explícita para evitar o ReferenceError
  const [barbershopData, setBarbershopData] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);
  const [tenantError, setTenantError] = useState("");

  // 2. ESTADOS DO FORMULÁRIO DE CADASTRO
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // 3. ESTADOS DE SUBMISSÃO E ERRO
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // BUSCA OS DADOS DA BARBEARIA DE FORMA SEGURA
  useEffect(() => {
    let isMounted = true;

    async function loadBarbershopData() {
      if (!barbershopSlug) {
        if (isMounted) {
          setTenantError("Nenhuma barbearia especificada na URL.");
          setLoadingBarbershop(false);
        }
        return;
      }

      try {
        setLoadingBarbershop(true);
        setTenantError("");
        const response = await api.get(`/barbershops/slug/${barbershopSlug}`);

        if (isMounted) {
          setBarbershopData(response.data);
        }
      } catch (err) {
        console.error("[REGISTER] Erro ao carregar dados do tenant:", err);
        if (isMounted) {
          setTenantError("Barbearia não encontrada ou indisponível.");
        }
      } finally {
        if (isMounted) {
          setLoadingBarbershop(false);
        }
      }
    }

    loadBarbershopData();

    return () => {
      isMounted = false; // Evita vazamento de memória se o componente desmontar
    };
  }, [barbershopSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !password) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 8) {
      setFormError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/users", {
        name,
        email,
        password,
        client_phone: phone,
        barbershopSlug,
      });

      // Redireciona para a tela de login do tenant
      navigate(`/${barbershopSlug}/login`, {
        state: { message: "Cadastro realizado com sucesso! Faça seu login." },
      });
    } catch (err) {
      console.error("[REGISTER ERROR]:", err);
      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erro ao realizar cadastro. Tente novamente.";
      setFormError(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // TELA 1: CARREGANDO TENANT
  if (loadingBarbershop) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p>Carregando dados da barbearia...</p>
      </div>
    );
  }

  // TELA 2: BARBEARIA NÃO ENCONTRADA
  if (tenantError) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>Barbearia não encontrada</h2>
        <p>{tenantError}</p>
      </div>
    );
  }

  // TELA 3: FORMULÁRIO DE CADASTRO
  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
      {/* Exibição da Logo e Nome da Barbearia com fallback seguro */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {barbershopData?.avatar_url || barbershopData?.logo ? (
          <img
            src={barbershopData.avatar_url || barbershopData.logo}
            alt={barbershopData?.name || "Logo Barbearia"}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#111",
              color: "#c9a84c",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {barbershopData?.name
              ? barbershopData.name.charAt(0).toUpperCase()
              : "B"}
          </div>
        )}

        <h1 style={{ fontSize: "1.5rem", marginTop: "12px" }}>
          Criar conta em {barbershopData?.name || "Barbearia"}
        </h1>
      </div>

      {formError && (
        <div
          style={{
            color: "#d9534f",
            marginBottom: "16px",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Nome completo *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>
            E-mail *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Telefone / WhatsApp
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Senha *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "12px",
            backgroundColor: "#c9a84c",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: submitting ? "not-allowed" : "pointer",
            marginTop: "12px",
          }}
        >
          {submitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem" }}>
        Já tem uma conta?{" "}
        <Link
          to={`/${barbershopSlug}/login`}
          style={{ color: "#c9a84c", fontWeight: "bold" }}
        >
          Fazer Login
        </Link>
      </p>
    </div>
  );
}
