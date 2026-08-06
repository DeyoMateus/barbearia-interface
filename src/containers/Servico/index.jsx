// src/containers/Servico/index.jsx
import React, { useEffect, useRef, useState } from "react";
import { GOLD_PALETTE } from "../../constants/theme";
import { drawScissors, drawRazor } from "../../utils/canvasHelpers";
import { generateWavePath, calculateWaveY } from "../../utils/waveMath";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { AnimatedBg } from "../../components/CartButton/AnimatedBg";
import {
    CardBlock,
    BlockNum,
    BlockIcon,
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
} from "./styles.js";

// Formata 'YYYY-MM-DD' para 'DD/MM/YYYY' de forma segura (evita bugs de fuso horário)
function formatarDataBR(dataStr) {
    if (!dataStr) return "";
    const apenasData = dataStr.split("T")[0];
    const partes = apenasData.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
}

// Formata 'HH:mm:ss' para 'HH:mm'
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
    const canvasRef = useRef(null);
    const toolsRef = useRef([]);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState("CONFIRMADOS");

    const [page, setPage] = useState(1);
    const itensPorPagina = 6;

    useEffect(() => {
        async function loadUserAppointments() {
            setLoading(true);
            try {
                // Buscamos os agendamentos do usuário
                const response = await api.get(`/agendamento?page=1&limit=6`, { withCredentials: true });
                setAppointments(response.data.appointments || []);
            } catch (error) {
                console.error("Erro ao carregar agendamentos:");
                toast.error("Não foi possível carregar seus agendamentos.");
            } finally {
                setLoading(false);
            }
        }
        loadUserAppointments();
    }, []);

    const executarCancelamentoNoBanco = async (appointmentId) => {
        try {
            await toast.promise(
                api.patch(
                    `/agendamento/${appointmentId}/status`,
                    {
                        status: APPOINTMENT_STATUS.CANCELED,
                        cancellation_reason: "Cancelado pelo cliente"
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
                prev.map((app) => (app.id === appointmentId ? { ...app, status: APPOINTMENT_STATUS.CANCELED } : app)),
            );
        } catch (error) {
            console.error("Erro interno ao cancelar:");
        }
    };

    const handleCancelarAgendamento = (appointmentId) => {
        const ConfirmacaoToast = ({ closeToast }) => (
            <div>
                <ConfirmToastText>Atenção! Deseja realmente cancelar este agendamento? ⚠️</ConfirmToastText>
                <ConfirmToastActions>
                    <ConfirmToastButton
                        $variant="danger"
                        onClick={() => {
                            closeToast();
                            executarCancelamentoNoBanco(appointmentId);
                        }}
                    >
                        Sim, cancelar
                    </ConfirmToastButton>
                    <ConfirmToastButton onClick={closeToast}>Voltar</ConfirmToastButton>
                </ConfirmToastActions>
            </div>
        );

        toast(<ConfirmacaoToast />, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            theme: "dark",
        });
    };

    // Filtragem correta sobre a lista completa
    const agendamentosFiltrados = appointments.filter((app) => {
        if (filtroStatus === "CONFIRMADOS") {
            return app.status?.toLowerCase() === APPOINTMENT_STATUS.CONFIRMED;
        }
        if (filtroStatus === "HISTORICO") {
            return app.status?.toLowerCase() !== APPOINTMENT_STATUS.CONFIRMED;
        }
        return true;
    });

    // Paginação calculada no frontend
    const totalPages = Math.ceil(agendamentosFiltrados.length / itensPorPagina) || 1;
    const agendamentosPaginados = agendamentosFiltrados.slice(
        (page - 1) * itensPorPagina,
        page * itensPorPagina
    );

    // Contagens totais reais para os botões de filtro
    const totalConfirmados = appointments.filter((a) => a.status?.toLowerCase() === APPOINTMENT_STATUS.CONFIRMED).length;
    const totalHistorico = appointments.filter((a) => a.status?.toLowerCase() !== APPOINTMENT_STATUS.CONFIRMED).length;

    return (
        <>
            <AnimatedBg />

            <PageContainer>
                <HeaderSection>
                    <MainTitle>Meus Agendamentos</MainTitle>
                    <Subtitle>Consulte o histórico e o status dos seus horários reservados.</Subtitle>
                </HeaderSection>

                <FilterBar>
                    <FilterButton
                        $active={filtroStatus === "CONFIRMADOS"}
                        onClick={() => { setFiltroStatus("CONFIRMADOS"); setPage(1); }}
                    >
                        Confirmados ({totalConfirmados})
                    </FilterButton>
                    <FilterButton
                        $active={filtroStatus === "HISTORICO"}
                        onClick={() => { setFiltroStatus("HISTORICO"); setPage(1); }}
                    >
                        Histórico ({totalHistorico})
                    </FilterButton>
                </FilterBar>

                {loading ? (
                    <StatusText $variant="loading">Carregando seus compromissos...</StatusText>
                ) : agendamentosPaginados.length === 0 ? (
                    <StatusText>Nenhum agendamento encontrado para este filtro.</StatusText>
                ) : (
                    <GridContainer>
                        {agendamentosPaginados.map((appt, index) => {
                            const statusAtual = appt.status?.toLowerCase();
                            // Numeração contínua calculada corretamente pela página
                            const numeroCard = String((page - 1) * itensPorPagina + index + 1).padStart(2, "0");

                            return (
                                <CardBlock key={appt.id || index}>
                                    <BlockNum>{numeroCard}</BlockNum>

                                    <BlockLabel>
                                        {formatarDataBR(appt.agendamento_date || appt.appointment_date)} — {formatarHoraBR(appt.agendamento_time || appt.appointment_time)}Hs
                                    </BlockLabel>

                                    <BlockTitle>{appt.service_name}</BlockTitle>

                                    <BlockBody>
                                        Profissional: {appt.barber?.name || "Especialista da Casa"} <br />
                                        Cliente: <strong>{appt.client_name}</strong>
                                    </BlockBody>

                                    <StatusTag status={statusAtual}>
                                        {(STATUS_LABELS[statusAtual] || STATUS_LABELS[appt.status] || statusAtual || "Confirmado").toUpperCase()}
                                    </StatusTag>

                                    {statusAtual === APPOINTMENT_STATUS.CONFIRMED && (
                                        <CancelButton onClick={() => handleCancelarAgendamento(appt.id)}>
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

                    <span>Página {page} de {totalPages}</span>

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