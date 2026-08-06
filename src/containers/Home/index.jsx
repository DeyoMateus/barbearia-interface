import React, { useEffect, useState, useRef } from "react";
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
  CarouselWrapper,
  ScrollButton,
  styles,
} from "./styles";
import { useCart } from "../../hooks/useCart.jsx";

// Fallback visual via URL
const BANNER_PADRAO =
  "https://placehold.co/800x400/1a1a1a/c9a84c?text=Barbearia";

// Helper idêntico ao do Login para formatar URLs relativas e absolutas
const formatImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const baseURL = api?.defaults?.baseURL || "http://localhost:3333";
  return `${baseURL}/${path.replace(/^\//, "")}`;
};

export function Home() {
  const navigate = useNavigate();
  const { barbershopSlug } = useParams();

  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Estado para controlar falhas silenciosas
  const [barbershop, setBarbershop] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);

  // Garante que cart sempre seja um array, prevenindo quebra de tela
  const { cart = [], toggleService, total, onCheckout } = useCart();

  // Referências para os carrosséis
  const categoryCarouselRef = useRef(null);
  const serviceCarouselRef = useRef(null);

  // Função de rolagem dos carrosséis
  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
              withCredentials: false,
            },
          );

          const data =
            barbershopResponse.data?.barbershop || barbershopResponse.data;
          setBarbershop(data);
        }

        // 2. Busca de Categorias
        const response = await api.get("/categories/service", {
          withCredentials: true,
        });

        // CORREÇÃO: Garante a extração segura do array de categorias
        const rawCategories = response.data?.categories || response.data;
        const safeCategories = Array.isArray(rawCategories)
          ? rawCategories
          : [];

        const categoriesFromApi = safeCategories.map((cat) => ({
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
        // Erro silencioso ativado no estado para o usuário ter feedback visual
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [barbershopSlug]);

  const currentCat = categoriesData?.find((c) => c.id === activeCategory);

  // Formata a imagem do banner usando o helper
  const bannerPath =
    barbershop?.home_banner_url || barbershop?.banner_url || barbershop?.banner;
  const bannerUrl = formatImageUrl(bannerPath, BANNER_PADRAO);

  // FEEDBACK DE ERRO PARA O USUÁRIO (Evita tela branca)
  if (error) {
    return (
      <Container>
        <AnimatedBg />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            color: "#c9a84c",
            textAlign: "center",
            paddingTop: "30vh",
            fontFamily: "sans-serif",
            padding: "0 20px",
          }}
        >
          <h2>Ops! Tivemos um problema de conexão.</h2>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            Não foi possível carregar os serviços. Tente atualizar a página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              background: "#c9a84c",
              color: "#1a0e00",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Atualizar Página
          </button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <AnimatedBg />
        <div
          style={{
            position: "relative",
            zIndex: 2,
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
    // Removido style={styles.container} para evitar erro caso a propriedade não exista
    <Container>
      <AnimatedBg />

      <ContainerRight>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
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

        {/* CARROSSEL DE CATEGORIAS COM SETAS */}
        <CarouselWrapper>
          <ScrollButton
            direction="left"
            onClick={() => handleScroll(categoryCarouselRef, "left")}
            aria-label="Voltar categorias"
          >
            ‹
          </ScrollButton>

          <ContainerCategory ref={categoryCarouselRef}>
            {categoriesData.map((cat) => {
              const active = cat.id === activeCategory;

              // Mantendo a funcionalidade antiga do contador no badge com fallback de segurança
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

          <ScrollButton
            direction="right"
            onClick={() => handleScroll(categoryCarouselRef, "right")}
            aria-label="Avançar categorias"
          >
            ›
          </ScrollButton>
        </CarouselWrapper>

        {/* CARROSSEL DE SERVIÇOS COM SETAS */}
        <ContainerServices>
          {currentCat && (
            <div>
              <h3 style={styles.categoryTitle}>
                {currentCat.icon} {currentCat.label}
              </h3>

              <CarouselWrapper>
                <ScrollButton
                  direction="left"
                  onClick={() => handleScroll(serviceCarouselRef, "left")}
                  aria-label="Voltar serviços"
                >
                  ‹
                </ScrollButton>

                <div ref={serviceCarouselRef} style={styles.carouselServices}>
                  {currentCat.services.map((service) => (
                    <div
                      key={service.id}
                      style={{
                        scrollSnapAlign: "start",
                        flexShrink: 0,
                        width: "280px",
                      }}
                    >
                      <ServiceCard
                        service={service}
                        inCart={!!cart.find((s) => s.id === service.id)}
                        onToggle={() => toggleService(service)}
                      />
                    </div>
                  ))}
                </div>

                <ScrollButton
                  direction="right"
                  onClick={() => handleScroll(serviceCarouselRef, "right")}
                  aria-label="Avançar serviços"
                >
                  ›
                </ScrollButton>
              </CarouselWrapper>
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
