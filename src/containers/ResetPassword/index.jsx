import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from "../../services/api.js";
import { toast } from "react-toastify";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

// Helpers e componentes visuais idênticos aos demais fluxos de autenticação
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

export function ResetPassword() {
    const { barbershopSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // O token geralmente vem via query param na URL (ex: ?token=xxx&email=xxx)
    const tokenFromUrl = searchParams.get("token") || "";
    const emailFromUrl = searchParams.get("email") || "";

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const toolsRef = useRef(createTools(42));
    const rafRef = useRef(null);

    const schema = yup.object({
        email: yup.string().email("Insira um e-mail válido").required("O e-mail é obrigatório"),
        token: yup.string().required("O token de recuperação é obrigatório"),
        new_password: yup.string().min(6, "A nova senha deve ter pelo menos 6 caracteres").required("A nova senha é obrigatória"),
    }).required();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: emailFromUrl,
            token: tokenFromUrl,
        }
    });

    // Animação de fundo canvas
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

    const onSubmit = async data => {
        try {
            await toast.promise(
                api.post('/reset-password', {
                    email: data.email.trim(),
                    token: data.token.trim(),
                    new_password: data.new_password,
                }),
                {
                    pending: 'Redefinindo sua senha...',
                    success: 'Senha redefinida com sucesso! Faça login. 🔒',
                    error: 'Token inválido ou expirado. Tente novamente. 🤯'
                }
            );

            setTimeout(() => {
                navigate(`/${barbershopSlug}/login`);
            }, 3000);

        } catch (error) {
            console.error("Erro no reset-password:");
        }
    };

    return (
        <Container ref={containerRef}>
            <CanvasBackground ref={canvasRef} />

            <RightContainer>
                <CardTopBorder />
                <CardBottomBorder />

                <BrandArea>
                    <span>✦ ✦ ✦</span>
                    {/*<img
                        src={barbershopData?.logo_url || DefaultLogo}
                        alt={barbershopData?.name || "Barbearia"}
                        className="new-logo"
                    />*/}
                    <p style={{ marginTop: '10px', fontSize: '11px', letterSpacing: '2px' }}>Nova Senha</p>
                </BrandArea>

                <Divider />

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <InputContainer>
                        <label>E-mail</label>
                        <input type="email" placeholder="seu@email.com" {...register("email")} />
                        <p>{errors?.email?.message}</p>
                    </InputContainer>

                    <InputContainer>
                        <label>Token de Recuperação</label>
                        <input type="text" placeholder="Cole o token recebido" {...register("token")} />
                        <p>{errors?.token?.message}</p>
                    </InputContainer>

                    <InputContainer>
                        <label>Nova Senha</label>
                        <input type="password" placeholder="••••••••" {...register("new_password")} />
                        <p>{errors?.new_password?.message}</p>
                    </InputContainer>

                    <Button type="submit">Salvar Nova Senha</Button>
                </Form>

                <FooterText>
                    <p>Lembrou a senha? <Link to={`/${barbershopSlug}/login`}>Entrar</Link></p>
                </FooterText>
            </RightContainer>
        </Container>
    );
}