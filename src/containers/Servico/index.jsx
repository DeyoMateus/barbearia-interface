import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
import {
  CardBlock,
  BlockNum,
  BlockLabel,
  BlockTitle,
  BlockBody,
  PageContainer,
  HeaderSection,
  MainTitle,
  Subtitle,
  GridContainer,
  StatusTag,
  FilterBar,
  FilterButton,
  CancelButton,
  StatusText,
  ConfirmToastText,
  ConfirmToastActions,
  ConfirmToastButton,
  PaginationContainer,
  PageButton,
  LocationButton,
  LocationContainer,
} from "./styles.js";

function formatarDataBR(dataStr) {
  if (!dataStr) return "";
  const apenasData = dataStr.split("T")[0];
  const partes = apenasData.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataStr;
}

function formatarHoraBR(horaStr) {
  if (!horaStr) return "";
  const partes = horaStr.split(":");
  if (partes.length >= 2) {
    return `${partes[0]}:${partes[1]}`;
  }
  return horaStr;
}

const APPOINTMENT_STATUS = {
  CONFIRMED: "scheduled",
  COMPLETED: "completed",
  CANCELED: "cancelled",
};

const STATUS_LABELS = {
  [APPOINTMENT_STATUS.CONFIRMED]: "Confirmado",
  [APPOINTMENT_STATUS.COMPLETED]: "Concluído",
  [APPOINTMENT_STATUS.CANCELED]: "Cancelado",
};

export const Servico = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("CONFIRMADOS");

  // Declarado corretamente com 'const'
  const [barbershopLocation, setBarbershopLocation] = useState({
    address: "Localização da Barbearia",
    url: "https://www.google.com/maps",
    name: "Barbearia",
  });

  const [page, setPage] = useState(1);
  const itensPorPagina = 6;

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const tenantSlug =
        localStorage.getItem("devclub:barbershop_slug") ||
        localStorage.getItem("tenant");

      try {
        // 1. Carrega os agendamentos
        const responseAppointments = await api.get(
          `/agendamento?page=1&limit=6`,
          { withCredentials: true },
        );
        setAppointments(responseAppointments.data.appointments || []);

        // 2. Busca o endereço/URL direto da rota existente no backend
        if (tenantSlug) {
          const responseBarbershop = await api.get(
            `/barbershops/${tenantSlug}`,
          );
          if (responseBarbershop?.data?.address) {
            setBarbershopLocation({
              address: responseBarbershop.data.address, // Contém a URL do banco
              url: responseBarbershop.data.address, // Redireciona para o link gravado
              name: responseBarbershop.data.name,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os agendamentos.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const executarCancelamentoNoBanco = async (
    appointmentId,
    motivoInformado,
  ) => {
    const motivoFinal = motivoInformado?.trim() || "Cancelado pelo cliente";

    try {
      await toast.promise(
        api.patch(
          `/agendamento/${appointmentId}/status`,
          {
            status: APPOINTMENT_STATUS.CANCELED,
            cancellation_reason: motivoFinal,
          },
          { withCredentials: true },
        ),
        {
          pending: "Removendo sua reserva da agenda... ⏳",
          success: "Horário cancelado com sucesso!",
          error: "Não foi possível processar o cancelamento.",
        },
      );

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId
            ? {
                ...app,
                status: APPOINTMENT_STATUS.CANCELED,
                cancellation_reason: motivoFinal,
              }
            : app,
        ),
      );
    } catch (error) {
      console.error("Erro interno ao cancelar:", error);
    }
  };

  const handleCancelarAgendamento = (appointmentId) => {
    const ConfirmacaoToast = ({ closeToast }) => {
      const [motivo, setMotivo] = useState("");

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <ConfirmToastText>
            Atenção! Deseja realmente cancelar este agendamento? ⚠️
          </ConfirmToastText>

          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo do cancelamento (opcional)"
            style={{
              padding: "8px 10px",
              borderRadius: "4px",
              border: "1px solid #444",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              outline: "none",
              fontSize: "13px",
            }}
          />

          <ConfirmToastActions>
            <ConfirmToastButton
              $variant="danger"
              onClick={() => {
                closeToast();
                executarCancelamentoNoBanco(appointmentId, motivo);
              }}
            >
              Sim, cancelar
            </ConfirmToastButton>
            <ConfirmToastButton onClick={closeToast}>Voltar</ConfirmToastButton>
          </ConfirmToastActions>
        </div>
      );
    };

    toast(<ConfirmacaoToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "dark",
    });
  };

  const agendamentosFiltrados = appointments.filter((app) => {
    if (filtroStatus === "CONFIRMADOS") {
      return app.status?.toLowerCase() === APPOINTMENT_STATUS.CONFIRMED;
    }
    if (filtroStatus === "HISTORICO") {
      return app.status?.toLowerCase() !== APPOINTMENT_STATUS.CONFIRMED;
    }
    return true;
  });

  const totalPages =
    Math.ceil(agendamentosFiltrados.length / itensPorPagina) || 1;
  const agendamentosPaginados = agendamentosFiltrados.slice(
    (page - 1) * itensPorPagina,
    page * itensPorPagina,
  );

  const totalConfirmados = appointments.filter(
    (a) => a.status?.toLowerCase() === APPOINTMENT_STATUS.CONFIRMED,
  ).length;
  const totalHistorico = appointments.filter(
    (a) => a.status?.toLowerCase() !== APPOINTMENT_STATUS.CONFIRMED,
  ).length;

  return (
    <>
      <AnimatedBg />

      <PageContainer>
        <HeaderSection>
          <LocationContainer>
            <LocationButton
              href="https://maps.app.goo.gl/EzmswP76uHtcfnBR8"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Ver Localização no Mapa
            </LocationButton>
          </LocationContainer>

          <MainTitle>Meus Agendamentos</MainTitle>
          <Subtitle>
            Consulte o histórico e o status dos seus horários reservados.
          </Subtitle>
        </HeaderSection>

        <FilterBar>
          <FilterButton
            $active={filtroStatus === "CONFIRMADOS"}
            onClick={() => {
              setFiltroStatus("CONFIRMADOS");
              setPage(1);
            }}
          >
            Confirmados ({totalConfirmados})
          </FilterButton>
          <FilterButton
            $active={filtroStatus === "HISTORICO"}
            onClick={() => {
              setFiltroStatus("HISTORICO");
              setPage(1);
            }}
          >
            Histórico ({totalHistorico})
          </FilterButton>
        </FilterBar>

        {loading ? (
          <StatusText $variant="loading">
            Carregando seus compromissos...
          </StatusText>
        ) : agendamentosPaginados.length === 0 ? (
          <StatusText>
            Nenhum agendamento encontrado para este filtro.
          </StatusText>
        ) : (
          <GridContainer>
            {agendamentosPaginados.map((appt, index) => {
              const statusAtual = appt.status?.toLowerCase();
              const numeroCard = String(
                (page - 1) * itensPorPagina + index + 1,
              ).padStart(2, "0");

              return (
                <CardBlock key={appt.id || index}>
                  <BlockNum>{numeroCard}</BlockNum>

                  <BlockLabel>
                    {formatarDataBR(
                      appt.agendamento_date || appt.appointment_date,
                    )}{" "}
                    —{" "}
                    {formatarHoraBR(
                      appt.agendamento_time || appt.appointment_time,
                    )}
                    Hs
                  </BlockLabel>

                  <BlockTitle>{appt.service_name}</BlockTitle>

                  <BlockBody>
                    Profissional: {appt.barber?.name || "Especialista da Casa"}{" "}
                    <br />
                    Cliente: <strong>{appt.client_name}</strong>
                  </BlockBody>

                  <StatusTag status={statusAtual}>
                    {(
                      STATUS_LABELS[statusAtual] ||
                      STATUS_LABELS[appt.status] ||
                      statusAtual ||
                      "Confirmado"
                    ).toUpperCase()}
                  </StatusTag>

                  {statusAtual === APPOINTMENT_STATUS.CANCELED &&
                    appt.cancellation_reason && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          backgroundColor: "rgba(255, 77, 79, 0.1)",
                          borderRadius: "6px",
                          border: "1px solid rgba(255, 77, 79, 0.3)",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#ff4d4f",
                            fontWeight: "bold",
                            display: "block",
                          }}
                        >
                          MOTIVO DO CANCELAMENTO:
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#e0e0e0",
                            marginTop: "2px",
                            display: "block",
                          }}
                        >
                          {appt.cancellation_reason}
                        </span>
                      </div>
                    )}

                  {statusAtual === APPOINTMENT_STATUS.CONFIRMED && (
                    <CancelButton
                      onClick={() => handleCancelarAgendamento(appt.id)}
                    >
                      Cancelar Horário
                    </CancelButton>
                  )}
                </CardBlock>
              );
            })}
          </GridContainer>
        )}

        <PaginationContainer>
          <PageButton
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Anterior
          </PageButton>

          <span>
            Página {page} de {totalPages}
          </span>

          <PageButton
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Próxima
          </PageButton>
        </PaginationContainer>
      </PageContainer>
    </>
  );
};

export default Servico;
