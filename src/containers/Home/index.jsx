import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
import { CartButton } from "../../components/CartButton/CartButton";
import { ServiceCard } from "../../services/cart1/ServiceCard.jsx";
import { useNavigate, useParams } from "react-router-dom";

import {
    Container,
    ContainerRight,
    HeroSection,
    ContainerCategory,
    ContainerServices,
    styles,
} from "./styles";
import { useCart } from "../../hooks/useCart.jsx";

const BANNER_PADRAO = "https://placehold.co/800x400/1a1a1a/c9a84c?text=Barbearia";

// Helper para tratar URLs relativas ou absolutas
const formatImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path;
    const baseURL = api.defaults.baseURL || "http://localhost:3333";
    return `${baseURL}/${path.replace(/^\//, "")}`;
};

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
            try {
                // 1. Busca os dados da Barbearia pelo Slug
                if (barbershopSlug) {
                    const barbershopResponse = await api.get(`/barbershops/${barbershopSlug}`, {
                        withCredentials: false,
                    });
                    setBarbershop(barbershopResponse.data);
                }

                // 2. Busca as categorias de serviço
                const response = await api.get("/categories/service", {
                    withCredentials: false,
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

    // Formata a URL da imagem no escopo do componente
    const bannerUrl = formatImageUrl(barbershop?.home_banner_url, BANNER_PADRAO);

    if (loading) {
        return (
            <Container>
                <div style={{ color: "#c9a84c", textAlign: "center", paddingTop: "30vh", fontFamily: "sans-serif" }}>
                    <h2>Carregando serviços...</h2>
                </div>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <AnimatedBg />

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