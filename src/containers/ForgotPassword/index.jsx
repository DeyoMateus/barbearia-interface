import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from "../../services/api.js";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

// Helpers e componentes visuais idênticos aos do Login
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
} from "../Login/styles.js"; // Reaproveita os estilos da tela de login!

import { Button } from "../../components/Button";

export function ForgotPassword() {
    const { barbershopSlug } = useParams();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const toolsRef = useRef(createTools(42));
    const rafRef = useRef(null);

    const schema = yup.object({
        email: yup.string().email("Insira um e-mail válido").required("O e-mail é obrigatório"),
    }).required();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    // Animação de fundo igualzinha à do Login
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
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, []);

    const onSubmit = async data => {
        try {
            await toast.promise(
                api.post('/forgot-password', {
                    email: data.email.trim(),
                }),
                {
                    pending: 'Enviando instruções...',
                    success: 'E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada. 📩',
                    error: 'Erro ao enviar e-mail. Verifique o endereço digitado. 🤯'
                }
            );

            setTimeout(() => {
                navigate(`/${barbershopSlug}/login`);
            }, 3000);

        } catch (error) {
            console.error("Erro no forgot-password:");
        }
    };

    return (
        <Container ref={containerRef}>
            <CanvasBackground ref={canvasRef} />

            <RightContainer>
                <CardTopBorder />
                <CardBottomBorder />

                {/*<BrandArea>
                    <span>✦ ✦ ✦</span>
                    <img
                        src={barbershopData?.logo_url || DefaultLogo}
                        alt={barbershopData?.name || "Barbearia"}
                        className="new-logo"
                    />
                    <p style={{ marginTop: '10px', fontSize: '11px', letterSpacing: '2px' }}>Recuperar Senha</p>
                </BrandArea>*/}

                <Divider />

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <InputContainer>
                        <label>E-mail cadastrado</label>
                        <input type="email" placeholder="seu@email.com" autoComplete="email" {...register("email")} />
                        <p>{errors?.email?.message}</p>
                    </InputContainer>

                    <Button type="submit">Enviar Instruções</Button>
                </Form>

                <FooterText>
                    <p>Lembrou a senha? <Link to={`/${barbershopSlug}/login`}>Entrar</Link></p>
                </FooterText>
            </RightContainer>
        </Container>
    );
}