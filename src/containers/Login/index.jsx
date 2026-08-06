import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../services/api.js";
import { toast } from "react-toastify";
import { useUser } from "../../hooks/userContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { salvarBarbershopSlug } from "../../utils/barbershopSlug.js";
import { Eye, EyeOff } from "lucide-react";

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
} from "./styles.js";
import { Button } from "../../components/Button";

const LOGO_PADRAO = "https://placehold.co/200x200/1a1a1a/c9a84c?text=Logo";

const formatImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const baseURL = api.defaults.baseURL || "http://localhost:3333";
  return `${baseURL}/${path.replace(/^\//, "")}`;
};

export function Login() {
  const { barbershopSlug } = useParams();
  const navigate = useNavigate();
  const { putUserData } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [barbershopData, setBarbershopData] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const toolsRef = useRef(createTools(42));
  const rafRef = useRef(null);

  useEffect(() => {
    if (barbershopSlug) {
      salvarBarbershopSlug(barbershopSlug);

      async function fetchBarbershop() {
        try {
          const response = await api.get(`/barbershops/${barbershopSlug}`, {
            withCredentials: false,
          });
          setBarbershopData(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados da barbearia:", error);
        } finally {
          setLoadingBarbershop(false);
        }
      }

      fetchBarbershop();
    } else {
      setLoadingBarbershop(false);
    }
  }, [barbershopSlug]);

  const schema = yup
    .object({
      email: yup
        .string()
        .email("Insira um e-mail válido")
        .required("O e-mail é obrigatório"),
      password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      ro.disconnect();
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const { data: userData } = await toast.promise(
        api.post("/sessions", {
          email: data.email.trim(),
          password: data.password,
        }),
        {
          pending: "Verificando seus dados",
          success: "Seja bem vindo(a)!👌",
          error: "Email ou senha incorretos!🤯",
        },
      );

      putUserData(userData);

      setTimeout(() => {
        if (!userData.privacy_accepted_at) {
          navigate(`/${barbershopSlug}/aceitar-politica`);
        } else {
          navigate("/app");
        }
      }, 1500);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logoUrl = formatImageUrl(barbershopData?.logo_url, LOGO_PADRAO);

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
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ) : (
            <img
              src={logoUrl}
              alt={barbershopData?.name || "Barbearia"}
              className="new-logo"
            />
          )}
        </BrandArea>

        <Divider />

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputContainer>
            <label>Usuário</label>
            <input
              type="email"
              placeholder="seu@email.com"
              autoComplete="username"
              {...register("email")}
            />
            <p>{errors?.email?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Senha</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
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
            <p>{errors?.password?.message}</p>
          </InputContainer>

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
              marginTop: "-10px",
            }}
          >
            <Link
              to={`/${barbershopSlug}/esqueci-senha`}
              style={{ fontSize: "11px" }}
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button type="submit">Entrar</Button>
        </Form>

        <FooterText>
          <p>
            Não possui conta?{" "}
            <Link to={`/${barbershopSlug}/cadastro`}> Clique aqui.</Link>
          </p>
        </FooterText>
      </RightContainer>
    </Container>
  );
}
