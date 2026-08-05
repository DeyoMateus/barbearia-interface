// src/containers/PainelBarbeiro/MeusAgendamentos/index.jsx
import React, { useState, useEffect, useCallback } from "react";
import { format, addDays } from "date-fns";
import { api } from "../../../services/api";
import { useUser } from "../../../hooks/userContext";
import { toast } from "react-toastify";

import {
    Wrapper,
    AvailabilitySection,
    SectionTitle,
    EmptyHint,
    TableWrapper,
    Table,
    TableHeadRow,
    Th,
    TableRow,
    Td,
    TdBold,
    TdGreen,
    TdRed,
    Divider,
    AppointmentsHeader,
    FiltersRow,
    FilterButton,
    EmptyBox,
    EmptyBoxText,
    CardsGrid,
    Card,
    CardTopRow,
    CardDate,
    CardTime,
    CardLabel,
    CardClientName,
    CardServiceName,
    CardBottomRow,
    StatusBadge,
    ActionsRow,
    ActionButtonComplete,
    ActionButtonCancel,
    PaginationContainer,
    PaginationButton,
    PaginationInfo,
    Content,
} from "./styles.js";

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

const DIAS_DA_SEMANA = {
    0: "Domingo", 1: "Segunda-feira", 2: "Terça-feira",
    3: "Quarta-feira", 4: "Quinta-feira", 5: "Sexta-feira", 6: "Sábado",
};

function getStatusStyles(status, dataString, horaString) {
    if (status === APPOINTMENT_STATUS.CANCELED) return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.1)" };
    if (status === APPOINTMENT_STATUS.COMPLETED) return { color: "#17ec34", bg: "rgba(136, 136, 136, 0.1)" };

    if (status === APPOINTMENT_STATUS.CONFIRMED || !status) {
        const agora = new Date();
        const dataCompromisso = new Date(`${dataString}T${horaString || "00:00"}`);
        return dataCompromisso >= agora
            ? { color: "#1a86c4", bg: "rgba(82, 196, 26, 0.1)" }
            : { color: "#fa8c16", bg: "rgba(250, 140, 22, 0.1)" };
    }
    return { color: "#ff9900", bg: "rgba(255, 153, 0, 0.1)" };
}

function formatarData(dataString) {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
}

export function MeusAgendamentos({ barberId, refreshTrigger }) {
    const [agendamentos, setAgendamentos] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState("ALL");

    // Filtro de datas (Hoje até +7 dias)
    const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));

    // Estados de Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    const { userInfo } = useUser();

    const loadDadosPainel = useCallback(async () => {
        if (!barberId) return;
        setLoading(true);

        try {
            const responseAgendamentos = await api.get(`/agendamento/listar`, {
                params: {
                    barber_id: barberId,
                    page,
                    limit,
                    startDate,
                    endDate,

                    status: filtroAtivo !== "ALL" ? APPOINTMENT_STATUS[filtroAtivo] : undefined,
                },
                withCredentials: true,
            });

            setAgendamentos(responseAgendamentos.data?.appointments || []);
            setTotalPages(responseAgendamentos.data?.pagination?.totalPages || 1);

            if (barberId !== "ALL") {
                const responseDisp = await api.get(`/disponibilidade/todas`, {
                    params: {
                        barber_id: barberId,
                        date: startDate,
                    },
                    withCredentials: true,
                });

                let dadosDisp = Array.isArray(responseDisp.data) ? responseDisp.data : [];
                dadosDisp.sort((a, b) => {
                    const diaA = a.day_of_week === 0 ? 7 : a.day_of_week;
                    const diaB = b.day_of_week === 0 ? 7 : b.day_of_week;
                    return diaA - diaB;
                });
                setDisponibilidades(dadosDisp);
            } else {
                setDisponibilidades([]);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do painel:");
        } finally {
            setLoading(false);
        }
    }, [barberId, page, startDate, endDate, filtroAtivo]);

    useEffect(() => {
        setPage(1);
    }, [barberId, startDate, endDate, filtroAtivo]);

    useEffect(() => {
        loadDadosPainel();
    }, [loadDadosPainel, refreshTrigger]);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {

            await api.patch(
                `/agendamento/${appointmentId}/status`,
                {
                    status: newStatus,
                },
                { withCredentials: true }
            );

            toast.success("Status do agendamento atualizado com sucesso!");
            loadDadosPainel();
        } catch (error) {
            console.error("Erro ao atualizar status:");

            const mensagemErro = error.response?.data?.error
                || error.response?.data?.message
                || "Erro ao atualizar o status do agendamento.";

            toast.error(mensagemErro);
        }
    };

    const isBarberOrAdmin = userInfo?.role === "barber" || userInfo?.role === "admin" || userInfo?.admin === true;

    return (
        <Wrapper>
            <Content $loading={loading}>

                {barberId !== "ALL" && (
                    <AvailabilitySection>
                        <SectionTitle>⚙️ Horários de Atendimento Salvos do Colaborador</SectionTitle>

                        {disponibilidades.length === 0 ? (
                            <EmptyHint>Nenhum horário de funcionamento configurado para este profissional.</EmptyHint>
                        ) : (
                            <TableWrapper>
                                <Table>
                                    <thead>
                                        <TableHeadRow>
                                            <Th>Dia da Semana</Th>
                                            <Th>Entrada</Th>
                                            <Th>Saída</Th>
                                            <Th>Tempo por Atendimento</Th>
                                        </TableHeadRow>
                                    </thead>
                                    <tbody>
                                        {disponibilidades.map((disp, index) => (
                                            <TableRow key={disp.id || index}>
                                                <TdBold>{DIAS_DA_SEMANA[disp.day_of_week]}</TdBold>
                                                <TdGreen>{disp.start_time?.slice(0, 5)}h</TdGreen>
                                                <TdRed>{disp.end_time?.slice(0, 5)}h</TdRed>
                                                <Td>{disp.interval_minutes || "30"} minutos</Td>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </Table>
                            </TableWrapper>
                        )}
                    </AvailabilitySection>
                )}

                {barberId !== "ALL" && <Divider />}

                <div>
                    <AppointmentsHeader>
                        🗓️ Compromissos Agendados {barberId === "ALL" && "(Visão Geral da Casa)"}
                    </AppointmentsHeader>

                    {/* Controles de Intervalo de Datas */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Data Inicial:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Data Final:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Botões de Filtro de Status */}
                    <FiltersRow>
                        {["ALL", "CONFIRMED", "COMPLETED", "CANCELED"].map((chave) => (
                            <FilterButton
                                key={chave}
                                $active={filtroAtivo === chave}
                                onClick={() => setFiltroAtivo(chave)}
                            >
                                {chave === "ALL" ? "Todos" : STATUS_LABELS[APPOINTMENT_STATUS[chave]] || chave}
                            </FilterButton>
                        ))}
                    </FiltersRow>

                    {/* Renderização usando 'agendamentos' diretamente da API */}
                    {agendamentos.length === 0 ? (
                        <EmptyBox>
                            <EmptyBoxText>Nenhum agendamento encontrado para este filtro.</EmptyBoxText>
                        </EmptyBox>
                    ) : (
                        <>
                            <CardsGrid>
                                {agendamentos.map((item) => {
                                    const statusAtual = item.status || APPOINTMENT_STATUS.CONFIRMED;
                                    const estiloVisual = getStatusStyles(statusAtual, item.appointment_date, item.appointment_time);

                                    return (
                                        <Card key={item.id} $accentColor={estiloVisual.color}>
                                            <div>
                                                <CardTopRow>
                                                    <CardDate $color={estiloVisual.color}>📅 {formatarData(item.appointment_date)}</CardDate>
                                                    <CardTime>⏰ {item.appointment_time?.slice(0, 5)}</CardTime>
                                                </CardTopRow>

                                                <CardLabel>CLIENTE</CardLabel>
                                                <CardClientName>{item.client_name || item.User?.name || "Cliente"}</CardClientName>

                                                <CardLabel>SERVIÇO</CardLabel>
                                                <CardServiceName>💈 {item.service_name || "Serviço"}</CardServiceName>
                                            </div>

                                            <div>
                                                <CardBottomRow>
                                                    <StatusBadge $bg={estiloVisual.bg} $color={estiloVisual.color}>
                                                        {(STATUS_LABELS[statusAtual] || statusAtual).toUpperCase()}
                                                    </StatusBadge>

                                                    {isBarberOrAdmin && statusAtual === APPOINTMENT_STATUS.CONFIRMED && (
                                                        <ActionsRow>
                                                            <ActionButtonComplete onClick={() => handleStatusUpdate(item.id, APPOINTMENT_STATUS.COMPLETED)}>
                                                                Concluir
                                                            </ActionButtonComplete>
                                                            <ActionButtonCancel onClick={() => handleStatusUpdate(item.id, APPOINTMENT_STATUS.CANCELED)}>
                                                                Cancelar
                                                            </ActionButtonCancel>
                                                        </ActionsRow>
                                                    )}
                                                </CardBottomRow>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </CardsGrid>

                            {/* Controles de Paginação */}
                            {totalPages > 1 && (
                                <PaginationContainer>
                                    <PaginationButton
                                        disabled={page <= 1}
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    >
                                        Anterior
                                    </PaginationButton>
                                    <PaginationInfo>
                                        Página {page} de {totalPages}
                                    </PaginationInfo>
                                    <PaginationButton
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    >
                                        Próxima
                                    </PaginationButton>
                                </PaginationContainer>
                            )}
                        </>
                    )}
                </div>

            </Content>
        </Wrapper>
    );
}