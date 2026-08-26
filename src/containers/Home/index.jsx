import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
import { CartButton } from "../../components/CartButton/CartButton";
import { ServiceCard } from "../../services/cart1/ServiceCard.jsx";
import { obterBarbershopSlug } from "../../utils/barbershopSlug.js";
import { useCart } from "../../hooks/useCart.jsx";
import { useCarousel } from "../../hooks/useCarousel.js";
import { useUser } from "../../hooks/userContext.jsx";

import {
  Container,
  ContainerRight,
  HeroSection,
  ContainerCategory,
  ContainerServices,
  ServicesScroll,
  CarouselWrapper,
  ScrollButton,
  styles,
} from "./styles";

const BANNER_PADRAO =
  "https://placehold.co/800x400/1a1a1a/c9a84c?text=Barbearia";

const formatImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const baseURL = api.defaults.baseURL || "http://localhost:3333";
  return `${baseURL}/${path.replace(/^\//, "")}`;
};

export function Home() {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const barbershopSlug = obterBarbershopSlug();

  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [barbershop, setBarbershop] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);

  const { cart, toggleService, total, onCheckout } = useCart();

  const categoryCarousel = useCarousel();
  const servicesCarousel = useCarousel();

  useEffect(() => {
    // 1. Cria o controlador para interceptar requisições
    const controller = new AbortController();

    async function loadData() {
      try {
        if (barbershopSlug) {
          const barbershopResponse = await api.get(
            `/barbershops/${barbershopSlug}`,
            {
              withCredentials: false,
              signal: controller.signal, // 2. Adiciona o sinal aqui
            },
          );
          setBarbershop(barbershopResponse.data);
        }

        const response = await api.get("/categories/service", {
          withCredentials: true,
          signal: controller.signal, // 3. Adiciona o sinal aqui também
        });

        const categoriesFromApi = (response.data?.categories || []).map(
          (cat) => ({
            id: cat.id,
            label: cat.name,
            icon: cat.icon,
            services: cat.services || [],
          }),
        );

        setCategoriesData(categoriesFromApi);

        if (categoriesFromApi.length > 0) {
          setActiveCategory(categoriesFromApi[0].id);
        }
      } catch (err) {
        // Se a requisição foi cancelada OU se deu 404 no momento de saída/mudança de rota
        if (
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED" ||
          err.response?.status === 404
        ) {
          console.log(
            "Requisição ignorada (componente desmontado ou saindo da página).",
          );
          return;
        }

        console.error("Erro ao buscar dados do banco:");
      } finally {
        // 5. Só altera o state de loading se a requisição não foi abortada
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    // 6. Função de limpeza (Cleanup): Acionada automaticamente quando o componente é destruído (ex: ao navegar para o login)
    return () => {
      controller.abort();
    };
  }, [barbershopSlug]);

  useEffect(() => {
    categoryCarousel.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesData]);

  useEffect(() => {
    const el = servicesCarousel.scrollRef.current;
    if (el) el.scrollLeft = 0;
    servicesCarousel.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const currentCat = categoriesData.find((c) => c.id === activeCategory);
  const bannerUrl = formatImageUrl(barbershop?.home_banner_url, BANNER_PADRAO);

  if (loading) {
    return (
      <Container style={{ background: "#080808", minHeight: "100vh" }}>
        <div
          style={{
            color: "#c9a84c",
            textAlign: "center",
            paddingTop: "30vh",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              letterSpacing: "2px",
              fontSize: "20px",
              color: "#c9a84c",
            }}
          >
            Carregando serviços...
          </h2>
        </div>
      </Container>
    );
  }

  const handleCheckout = () => {
    const canAvancar = onCheckout();
    if (!canAvancar) {
      alert("Selecione pelo menos um serviço para agendar!");
      return;
    }

    if (!userInfo) {
      const irParaLogin = window.confirm(
        "Você precisa estar logado para agendar um horário. Deseja ir para a tela de login agora?",
      );
      if (irParaLogin) {
        navigate(barbershopSlug ? `/${barbershopSlug}/login` : "/");
      }
      return;
    }

    navigate("/app/agendamento");
  };

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
        </header>

        <HeroSection>
          <div>
            <h2 style={styles.heroTitle}>
              {userInfo?.name ? `Olá, ${userInfo.name.split(" ")[0]}, ` : ""}
              <span style={{ color: "#c9a84c", fontStyle: "italic" }}>
                bem-vindo de volta!
              </span>
            </h2>
            <p style={styles.heroSubtitle}>
              Escolha os serviços desejados abaixo.
            </p>
            <p style={styles.heroSubtitle}>
              Para serviços que envolvem o uso de produtos, o valor pode variar
              de acordo com o tamanho do cabelo.
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

        <CarouselWrapper>
          <ScrollButton
            type="button"
            $direction="left"
            $visible={categoryCarousel.canScrollLeft}
            aria-hidden={!categoryCarousel.canScrollLeft}
            tabIndex={categoryCarousel.canScrollLeft ? 0 : -1}
            aria-label="Categoria anterior"
            onClick={() => categoryCarousel.scroll("left")}
          >
            ‹
          </ScrollButton>

          <ContainerCategory ref={categoryCarousel.scrollRef}>
            {categoriesData.map((cat) => {
              const active = cat.id === activeCategory;
              const countInCat = cart.filter((s) =>
                cat.services.some((x) => x.id === s.id),
              ).length;

              return (
                <button
                  key={cat.id} // Chave limpa apenas com o ID original
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
            type="button"
            $direction="right"
            $visible={categoryCarousel.canScrollRight}
            aria-hidden={!categoryCarousel.canScrollRight}
            tabIndex={categoryCarousel.canScrollRight ? 0 : -1}
            aria-label="Próxima categoria"
            onClick={() => categoryCarousel.scroll("right")}
          >
            ›
          </ScrollButton>
        </CarouselWrapper>

        <ContainerServices>
          {currentCat && (
            <>
              <h3 style={styles.categoryTitle}>
                {currentCat.icon} {currentCat.label}
              </h3>

              <CarouselWrapper>
                <ScrollButton
                  type="button"
                  $direction="left"
                  $visible={servicesCarousel.canScrollLeft}
                  aria-hidden={!servicesCarousel.canScrollLeft}
                  tabIndex={servicesCarousel.canScrollLeft ? 0 : -1}
                  aria-label="Serviço anterior"
                  onClick={() => servicesCarousel.scroll("left")}
                >
                  ‹
                </ScrollButton>

                <ServicesScroll ref={servicesCarousel.scrollRef}>
                  {currentCat.services.map((service) => (
                    <ServiceCard
                      key={service.id} // Chave limpa apenas com o ID original
                      service={service}
                      inCart={!!cart.find((s) => s.id === service.id)}
                      onToggle={() => toggleService(service)}
                    />
                  ))}
                </ServicesScroll>

                <ScrollButton
                  type="button"
                  $direction="right"
                  $visible={servicesCarousel.canScrollRight}
                  aria-hidden={!servicesCarousel.canScrollRight}
                  tabIndex={servicesCarousel.canScrollRight ? 0 : -1}
                  aria-label="Próximo serviço"
                  onClick={() => servicesCarousel.scroll("right")}
                >
                  ›
                </ScrollButton>
              </CarouselWrapper>
            </>
          )}
        </ContainerServices>
      </ContainerRight>

      <CartButton count={cart.length} total={total} onClick={handleCheckout} />
    </Container>
  );
}
