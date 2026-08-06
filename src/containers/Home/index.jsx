import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
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
} from "./styles";
import { useCart } from "../../hooks/useCart.jsx";

const BANNER_PADRAO =
  "https://placehold.co/800x400/1a1a1a/c9a84c?text=Barbearia";
const LOGO_PADRAO = "https://placehold.co/200x200/1a1a1a/c9a84c?text=Logo";

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
      const targetSlug = barbershopSlug || obterBarbershopSlug();

      try {
        if (targetSlug) {
          const barbershopResponse = await api.get(
            `/barbershops/${targetSlug}`,
            { withCredentials: true },
          );

          // CORREÇÃO: Garante o resgate dos dados independente de vir direto ou dentro de response.data.barbershop
          const data =
            barbershopResponse.data?.barbershop || barbershopResponse.data;
          setBarbershop(data);
        }

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

  // CORREÇÃO: Fallbacks flexíveis para diferentes nomes de campos do BD (home_banner_url / banner_url / banner)
  const bannerPath =
    barbershop?.home_banner_url || barbershop?.banner_url || barbershop?.banner;
  const bannerUrl = formatImageUrl(bannerPath, BANNER_PADRAO);

  // CORREÇÃO: Adicionada a busca formatada da Logo
  const logoPath = barbershop?.logo_url || barbershop?.logo;
  const logoUrl = formatImageUrl(logoPath, LOGO_PADRAO);

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
      <AnimatedBg />

      <ContainerRight>
        {/* Header ajustado com a renderização da Logo da Barbearia */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <img
            src={logoUrl}
            alt={barbershop?.name || "Logo Barbearia"}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #c9a84c",
            }}
          />
          <div>
            <h1 style={styles.brandTitle}>
              {barbershop?.name || "Premium Barber"}
            </h1>
          </div>
          <span style={{ ...styles.clientBadge, marginLeft: "auto" }}>
            Olá, Cliente
          </span>
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
          const canAvancar = onCheckout();
          if (canAvancar) {
            navigate("/app/agendamento");
          } else {
            alert("Selecione pelo menos um serviço para agendar!");
          }
        }}
      />
    </Container>
  );
}
