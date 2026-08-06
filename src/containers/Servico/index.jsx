// src/containers/Servico/index.jsx
import React, { useEffect, useRef, useState } from "react";
import { GOLD_PALETTE } from "../../constants/theme";
import { drawScissors, drawRazor } from "../../utils/canvasHelpers";
import { generateWavePath, calculateWaveY } from "../../utils/waveMath";
import { api } from "../../services/api";
import { toast } from "react-toastify";

import {
    CanvasElement,
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
                const response = await api.get(`/agendamento?page=2&limit=6`, { withCredentials: true });
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
            <CanvasElement ref={canvasRef} id="bg-canvas" />

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