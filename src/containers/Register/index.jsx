import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../services/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { salvarBarbershopSlug } from "../../utils/barbershopSlug.js";
import { Eye, EyeOff } from "lucide-react";

// helpers importados das pastas para animação
import { createTools, renderFrame } from "../../utils/canvasHelpers";

import {
  Container,
  Form,
  InputContainer,
  RightContainer,
  Link,
  CanvasBackground,
  BrandArea,
  Divider,
  FooterText,
  CardTopBorder,
  CardBottomBorder,
} from "./styles.js";

import { Button } from "../../components/Button";
import { toast } from "react-toastify";

const LOGO_PADRAO = "https://placehold.co/200x200/1a1a1a/c9a84c?text=Logo";

const formatImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const baseURL = api.defaults.baseURL || "http://localhost:3333";
  return `${baseURL}/${path.replace(/^\//, "")}`;
};

export function Register() {
  const { barbershopSlug } = useParams();
  const navigate = useNavigate();

  // Estados para controlar a visibilidade da Senha e Confirmar Senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para a logo e dados da barbearia
  const [barbershopData, setBarbershopData] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const toolsRef = useRef(createTools(42));
  const rafRef = useRef(null);

  // Busca os dados da barbearia dinamicamente pelo slug
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

  // Schema de validação do formulário
  const schema = yup
    .object({
      name: yup.string().required("Nome é obrigatório"),
      email: yup
        .string()
        .email("Insira um e-mail válido")
        .required("O e-mail é obrigatório"),
      client_phone: yup.string().required("O telefone é obrigatório"),
      password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "As senhas devem ser iguais")
        .required("Confirme sua senha"),
      acceptsPrivacyPolicy: yup
        .boolean()
        .oneOf(
          [true],
          "Você precisa aceitar a Política de Privacidade para continuar.",
        )
        .required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Animação de fundo no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;

    function resize() {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
    }
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
      const { status } = await api.post(
        "/users",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          client_phone: data.client_phone,
          acceptsPrivacyPolicy: data.acceptsPrivacyPolicy,
        },
        {
          validateStatus: () => true,
        },
      );

      if (status === 200 || status === 201) {
        toast.success("Conta criada com sucesso 🫡​🫡​");
        setTimeout(() => {
          navigate(`/${barbershopSlug}/login`);
        }, 2000);
      } else if (status === 409 || status === 400) {
        toast.error(
          "Email já está cadastrado, faça login para continuar 😉​😉​",
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Falha no sistema tente novamente!🥺🥺");
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
            <label>Nome</label>
            <input type="text" placeholder="seu nome" {...register("name")} />
            <p>{errors?.name?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Email</label>
            <input
              type="text"
              placeholder="seu@email.com"
              {...register("email")}
            />
            <p>{errors?.email?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Telefone</label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("client_phone")}
            />
            <p>{errors?.client_phone?.message}</p>
          </InputContainer>

          {/* Campo Senha com Olhinho */}
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

          {/* Campo Confirmar Senha com Olhinho */}
          <InputContainer>
            <label>Confirmar Senha</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                style={{ width: "100%", paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p>{errors?.confirmPassword?.message}</p>
          </InputContainer>

          <InputContainer>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                textAlign: "left",
              }}
            >
              <input
                type="checkbox"
                {...register("acceptsPrivacyPolicy")}
                style={{ marginTop: 3 }}
              />
              <span>
                Li e aceito a{" "}
                <Link to="/politica-de-privacidade" target="_blank">
                  Política de Privacidade
                </Link>
              </span>
            </label>
            <p>{errors?.acceptsPrivacyPolicy?.message}</p>
          </InputContainer>

          <Button type="submit">Criar Conta</Button>
        </Form>

        <FooterText>
          <p>
            Já possui conta?{" "}
            <Link to={`/${barbershopSlug}/login`}> Clique aqui.</Link>
          </p>
        </FooterText>
      </RightContainer>
    </Container>
  );
}
