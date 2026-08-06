import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
//import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
import { CartButton } from "../../components/CartButton/CartButton";
import { ServiceCard } from "../../services/cart1/ServiceCard.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { obterBarbershopSlug } from "../../utils/barbershopSlug.js";

import {
    Container,
    ContainerRight,
    HeroSection,
    ContainerCategory,
    ContainerServices,
    styles,
    CanvasElement,
} from "./styles";
import { useCart } from "../../hooks/useCart.jsx";

// Fallback visual via URL
const BANNER_PADRAO =
    "https://placehold.co/800x400/1a1a1a/c9a84c?text=Barbearia";

// Helper idêntico ao do Login para formatar URLs relativas e absolutas
const formatImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path;
    const baseURL = api.defaults.baseURL || "http://localhost:3333";
    return `${baseURL}/${path.replace(/^\//, "")}`;
};

// 🎨 Efeito do Canvas (animação de fundo)
useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const WAVE_Y = 0.82;
    const NUM_TOOLS = 46;

    if (toolsRef.current.length === 0) {
        toolsRef.current = Array.from({ length: NUM_TOOLS }, () => ({
            type: Math.random() > 0.44 ? "sci" : "raz",
            x: Math.random(),
            y: Math.random() * 0.82,
            size: 13 + Math.random() * 24,
            angle: Math.random() * Math.PI * 2,
            aSpd: (0.002 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
            dx: (Math.random() - 0.5) * 0.00025,
            dy: (Math.random() - 0.5) * 0.00016,
            op: Math.random() * Math.PI * 2,
            os: 0.03 + Math.random() * 0.07,
            ci: Math.floor(Math.random() * GOLD_PALETTE.length),
            alpha: 0.11 + Math.random() * 0.24,
            layer: Math.random(),
        }));
    }

    const render = (ts) => {
        const t = ts * 0.001;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#080808";
        ctx.fillRect(0, 0, W, H);

        const sortedTools = [...toolsRef.current].sort((a, b) => a.layer - b.layer);

        sortedTools.forEach((tool) => {
            tool.x += tool.dx;
            tool.y += tool.dy;
            tool.angle += tool.aSpd * 0.016;

            if (tool.x < -0.08) tool.x = 1.08;
            if (tool.x > 1.08) tool.x = -0.08;
            if (tool.y < -0.08) tool.y = WAVE_Y - 0.02;
            if (tool.y > WAVE_Y - 0.015) tool.y = 0.02;

            const color = GOLD_PALETTE[tool.ci];
            ctx.save();
            ctx.globalAlpha = tool.alpha * (0.65 + tool.layer * 0.5);
            ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, 1)`;
            ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, 1)`;
            ctx.lineWidth = 0.8;

            if (tool.type === "sci") {
                const o = (Math.sin(t * tool.os * 3 + tool.op) + 1) / 2;
                drawScissors(ctx, tool.x * W, tool.y * H, tool.size, tool.angle, o);
            } else {
                drawRazor(ctx, tool.x * W, tool.y * H, tool.size, tool.angle);
            }
            ctx.restore();
        });

        generateWavePath(ctx, t, W, H, WAVE_Y);
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, calculateWaveY(0, t, WAVE_Y) * H, 0, H);
        gradient.addColorStop(0, "hsla(44,92%,70%,.96)");
        gradient.addColorStop(0.05, "hsla(41,87%,55%,.98)");
        gradient.addColorStop(0.15, "hsla(39,82%,44%,1)");
        gradient.addColorStop(0.35, "hsla(36,76%,33%,1)");
        gradient.addColorStop(0.6, "hsla(33,70%,22%,1)");
        gradient.addColorStop(1, "hsla(30,58%,10%,1)");
        ctx.fillStyle = gradient;
        ctx.fill();

        for (let i = 0; i < 8; i++) {
            const xOff = (i / 8 + t * 0.038) % 1;
            const brightness = 0.055 + 0.09 * Math.sin(t * 1.1 + i * 1.4);
            const x = xOff * W;
            const waveYPosition = calculateWaveY(xOff, t, WAVE_Y) * H;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, waveYPosition + 3);
            ctx.lineTo(x + 50, H);
            ctx.lineWidth = 9 + 6 * Math.sin(t * 0.8 + i);
            ctx.strokeStyle = `rgba(255,225,110,${brightness})`;
            ctx.stroke();
            ctx.restore();
        }

        animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
    };
}, []);

export function Home() {
    const navigate = useNavigate();
    const { barbershopSlug } = useParams();

    const [activeCategory, setActiveCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [barbershop, setBarbershop] = useState(null);
    const [categoriesData, setCategoriesData] = useState([]);

    const { cart, toggleService, total, onCheckout } = useCart();

    useEffect(() => {
        async function loadData() {
            // Pega o slug da URL ou do localStorage (caso esteja em rota /app)
            const targetSlug = barbershopSlug || obterBarbershopSlug();

            try {
                // 1. Replicando a busca da Barbearia pelo Slug (como no Login)
                if (targetSlug) {
                    const barbershopResponse = await api.get(
                        `/barbershops/${targetSlug}`,
                        {
                            withCredentials: true,
                        }
                    );
                    setBarbershop(barbershopResponse.data);
                }

                // 2. Busca de Categorias
                const response = await api.get("/categories/service", {
                    withCredentials: true,
                });

                const categoriesFromApi = response.data.categories.map((cat) => ({
                    id: cat.id,
                    label: cat.name,
                    icon: cat.icon,
                    services: cat.services || [],
                }));

                setCategoriesData(categoriesFromApi);

                if (categoriesFromApi.length > 0) {
                    setActiveCategory(categoriesFromApi[0].id);
                }
            } catch (err) {
                console.error("Erro ao buscar dados do banco:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [barbershopSlug]);

    const currentCat = categoriesData?.find((c) => c.id === activeCategory);

    // Formata a imagem do banner usando o helper
    const bannerUrl = formatImageUrl(barbershop?.home_banner_url, BANNER_PADRAO);

    if (loading) {
        return (
            <Container>
                <div
                    style={{
                        color: "#c9a84c",
                        textAlign: "center",
                        paddingTop: "30vh",
                        fontFamily: "sans-serif",
                    }}
                >
                    <h2>Carregando serviços do banco...</h2>
                </div>
            </Container>
        );
    }

    return (


        <Container style={styles.container}>
            <CanvasElement ref={canvasRef} id="bg-canvas" />

            <ContainerRight>
                <header>
                    <div>
                        <h1 style={styles.brandTitle}>
                            {barbershop?.name || "Premium Barber"}
                        </h1>
                    </div>
                    <span style={styles.clientBadge}>Olá, Cliente</span>
                </header>

                <HeroSection>
                    <div>
                        <h2 style={styles.heroTitle}>
                            Sua presença merece o{" "}
                            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>
                                alto padrão
                            </span>
                        </h2>
                        <p style={styles.heroSubtitle}>
                            Escolha os serviços desejados abaixo.
                        </p>
                        <div style={styles.heroDivider} />
                    </div>

                    <div style={styles.heroImageWrapper}>
                        <div style={styles.heroOverlay} />
                        <img
                            src={bannerUrl}
                            alt={`Banner de ${barbershop?.name || "Barbearia"}`}
                            className="banner-img"
                            style={styles.heroImg}
                        />
                    </div>
                </HeroSection>

                <ContainerCategory>
                    {categoriesData.map((cat) => {
                        const active = cat.id === activeCategory;
                        const countInCat = cart.filter((s) =>
                            categoriesData
                                .find((c) => c.id === cat.id)
                                ?.services.some((x) => x.id === s.id),
                        ).length;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={styles.tabButton(active)}
                            >
                                <span>{cat.icon || "✦"}</span>
                                {cat.label}
                                {countInCat > 0 && (
                                    <span style={styles.tabBadge(active)}>{countInCat}</span>
                                )}
                            </button>
                        );
                    })}
                </ContainerCategory>

                <ContainerServices>
                    {currentCat && (
                        <div style={styles.gridServices}>
                            <h3 style={styles.categoryTitle}>
                                {currentCat.icon} {currentCat.label}
                            </h3>

                            {currentCat.services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    inCart={!!cart.find((s) => s.id === service.id)}
                                    onToggle={() => toggleService(service)}
                                />
                            ))}
                        </div>
                    )}
                </ContainerServices>
            </ContainerRight>

            <CartButton
                count={cart.length}
                total={total}
                onClick={() => {
                    const canAvançar = onCheckout();
                    if (canAvançar) {
                        navigate("/app/agendamento");
                    } else {
                        alert("Selecione pelo menos um serviço para agendar!");
                    }
                }}
            />
        </Container>
    );
}