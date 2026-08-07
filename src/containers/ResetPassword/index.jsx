import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../services/api.js";
import { toast } from "react-toastify";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Helpers e componentes visuais
import { createTools, renderFrame } from "../../utils/canvasHelpers";
import {
  Container,
  Form,
  InputContainer,
  RightContainer,
  Link,
  CanvasBackground,
  CardTopBorder,
  CardBottomBorder,
  BrandArea,
  Divider,
  FooterText,
} from "../Login/styles.js";
import { Button } from "../../components/Button";

const LOGO_PADRAO = "https://placehold.co/200x200/1a1a1a/c9a84c?text=Logo";

const formatImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const baseURL = api.defaults.baseURL || "http://localhost:3333";
  return `${baseURL}/${path.replace(/^\//, "")}`;
};

export function ResetPassword() {
  const { barbershopSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados para controlar a visibilidade da Senha
  const [showPassword, setShowPassword] = useState(false);

  // Dados e carregamento da Barbearia (Logo e Nome)
  const [barbershopData, setBarbershopData] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);

  // Parâmetros recebidos da URL (ex: ?token=xxx&email=xxx)
  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const toolsRef = useRef(createTools(42));
  const rafRef = useRef(null);

  // Schema de Validação (Mínimo 8 caracteres na senha)
  const schema = yup
    .object({
      email: yup
        .string()
        .email("Insira um e-mail válido")
        .required("O e-mail é obrigatório"),
      token: yup.string().required("O token de recuperação é obrigatório"),
      new_password: yup
        .string()
        .min(8, "A nova senha deve ter pelo menos 8 caracteres")
        .required("A nova senha é obrigatória"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFromUrl,
      token: tokenFromUrl,
    },
  });

  // 1. Busca os dados da barbearia (Logo e Nome) corretamente do banco
  useEffect(() => {
    let isMounted = true;

    async function loadBarbershopData() {
      if (!barbershopSlug) {
        setLoadingBarbershop(false);
        return;
      }

      try {
        const response = await api.get(`/barbershops/${barbershopSlug}`, {
          withCredentials: false,
        });
        if (isMounted) {
          setBarbershopData(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar marca da barbearia:", error);
      } finally {
        if (isMounted) {
          setLoadingBarbershop(false);
        }
      }
    }

    loadBarbershopData();

    return () => {
      isMounted = false;
    };
  }, [barbershopSlug]);

  // 2. Animação de fundo no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    function loop(ts) {
      const t = ts * 0.001;
      renderFrame(ctx, toolsRef.current, W, H, t);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  // 3. Submissão do Formulário
  const onSubmit = async (data) => {
    try {
      await toast.promise(
        api.post("/reset-password", {
          email: data.email.trim(),
          token: data.token.trim(),
          new_password: data.new_password,
        }),
        {
          pending: "Redefinindo sua senha...",
          success: "Senha redefinida com sucesso! Faça login. 🔒",
          error: "Token inválido ou expirado. Tente novamente. 🤯",
        },
      );

      setTimeout(() => {
        navigate(`/${barbershopSlug}/login`);
      }, 2500);
    } catch (error) {
      console.error("[RESET PASSWORD ERROR]:", error);
    }
  };

  const logoUrl = formatImageUrl(
    barbershopData?.logo_url || barbershopData?.logo,
    LOGO_PADRAO,
  );

  return (
    <Container ref={containerRef}>
      <CanvasBackground ref={canvasRef} />

      <RightContainer>
        <CardTopBorder />
        <CardBottomBorder />

        <BrandArea>
          {loadingBarbershop ? (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ) : (
            <img
              src={logoUrl}
              alt={barbershopData?.name || "Barbearia"}
              className="new-logo"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <p
            style={{
              marginTop: "10px",
              fontSize: "11px",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            {barbershopData?.name
              ? barbershopData.name.toUpperCase()
              : "NOVA SENHA"}
          </p>
        </BrandArea>

        <Divider />

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputContainer>
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            <p>{errors?.email?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Token de Recuperação</label>
            <input
              type="text"
              placeholder="Cole o token recebido"
              {...register("token")}
            />
            <p>{errors?.token?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Nova Senha</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                {...register("new_password")}
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#888",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p>{errors?.new_password?.message}</p>
          </InputContainer>

          <Button type="submit">Salvar Nova Senha</Button>
        </Form>

        <FooterText>
          <p>
            Lembrou a senha? <Link to={`/${barbershopSlug}/login`}>Entrar</Link>
          </p>
        </FooterText>
      </RightContainer>
    </Container>
  );
}
