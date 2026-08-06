import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../../hooks/useCart.jsx";
import { useUser } from "../../hooks/userContext.jsx";
import { api } from "../../services/api.js";
import { C } from "../../constants/theme.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { ServiceCard } from "../../services/cart1/ServiceCard.jsx";
import { GoldBtn } from "../../components/buttongold/GoldBtn.jsx";

// IMPORTAÇÃO DOS ESTILOS SEPARADOS
import * as S from "./styles.js";

export function Agendamento() {
    const { cart, total, clearCart, toggleService } = useCart();
    const { userInfo } = useUser();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);

    const [barbers, setBarbers] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState("");
    const [loadingTimes, setLoadingTimes] = useState(false);

    // Estado para gerenciar o plano mensal (Check-in presencial)
    const [isMonthlyPlan, setIsMonthlyPlan] = useState(false);

    // Dados do Cliente para Agendamento por Barbeiro/Admin
    const [customClientName, setCustomClientName] = useState("");
    const [customClientPhone, setCustomClientPhone] = useState("");

    // Identifica se o usuário logado faz parte da equipe (Admin ou Barbeiro)
    const isEmployee =
        userInfo?.admin === true ||
        userInfo?.role === "admin" ||
        userInfo?.role === "barber";

    // CÁLCULO DA DATA E HORA LOCAL ATUAL
    const todayObj = new Date();
    const year = todayObj.getFullYear();
    const month = String(todayObj.getMonth() + 1).padStart(2, "0");
    const day = String(todayObj.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    const nowHours = String(todayObj.getHours()).padStart(2, "0");
    const nowMinutes = String(todayObj.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${nowHours}:${nowMinutes}`;

    useEffect(() => {
        document.body.style.backgroundColor = "#0a0a08";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    // Carrega a lista de barbeiros
    useEffect(() => {
        async function loadBarbers() {
            try {
                const response = await api.get("/barbers");
                setBarbers(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar barbeiros:", error);
                toast.error("Não foi possível carregar a lista de profissionais.");
            }
        }
        loadBarbers();
    }, []);

    // Função encapsulada com useCallback para poder re-executar após conflitos
    const fetchHorarios = useCallback(async () => {
        if (!selectedDate || !selectedBarber) {
            setAvailableTimes([]);
            return;
        }

        try {
            setLoadingTimes(true);

            const response = await api.get("/disponibilidade", {
                params: {
                    barber_id: selectedBarber,
                    date: selectedDate
                }
            });

            const dadosHorarios = response.data.slots || response.data;
            let slotsTratados = [];

            if (Array.isArray(dadosHorarios) && dadosHorarios.length > 0 && typeof dadosHorarios[0] === 'string') {
                slotsTratados = dadosHorarios.map(hora => ({
                    time: hora,
                    available: true,
                    reason: ""
                }));
            } else {
                slotsTratados = Array.isArray(dadosHorarios) ? dadosHorarios : [];
            }

            if (selectedDate === todayStr) {
                slotsTratados = slotsTratados.map(slot => {
                    if (slot.time < currentTimeStr) {
                        return {
                            ...slot,
                            available: false,
                            reason: "Este horário já passou."
                        };
                    }
                    return slot;
                });
            }

            setAvailableTimes(slotsTratados);

        } catch (error) {
            console.error("Erro ao buscar horários da API:", error);
            toast.error("Erro ao carregar horários disponíveis do barbeiro.");
            setAvailableTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    }, [selectedDate, selectedBarber, todayStr, currentTimeStr]);

    useEffect(() => {
        setSelectedTime("");
        fetchHorarios();
    }, [fetchHorarios]);

    const handleConfirmarAgendamento = async () => {
        if (!selectedBarber) {
            toast.warning("Por favor, selecione um barbeiro!");
            return;
        }
        if (!selectedDate || !selectedTime) {
            toast.warning("Por favor, selecione uma data e um horário!");
            return;
        }
        if (!userInfo) {
            toast.error("Usuário não identificado. Faça login novamente.");
            return;
        }

        if (selectedDate < todayStr || (selectedDate === todayStr && selectedTime < currentTimeStr)) {
            toast.error("Você selecionou um horário que já passou! Escolha outra opção.");
            return;
        }

        try {
            const finalClientName = isEmployee
                ? (customClientName.trim() || userInfo.name)
                : userInfo.name;

            const finalClientPhone = isEmployee
                ? (customClientPhone.trim() || userInfo.client_phone || "Não informado")
                : (userInfo.client_phone || "Não informado");

            const dadosAgendamento = {
                barber_id: selectedBarber,
                barbershop_id: userInfo.barbershop_id,
                appointment_date: selectedDate,
                appointment_time: selectedTime,
                service_ids: cart.map(item => Number(item.id)),
                service_name: cart.map(s => s.name).join(", "),
                client_name: finalClientName,
                client_phone: finalClientPhone,
                is_monthly_plan: isMonthlyPlan
            };

            await api.post("/agendamento", dadosAgendamento);

            toast.success("Presença confirmada com sucesso!");
            clearCart();
            navigate("/");

        } catch (error) {
            console.error("Erro completo da API:", error);

            // Captura a mensagem detalhada tratada pelo backend (Ex: Conflito de horário ou limite atingido)
            const errorMessage = error.response?.data?.error
                || (Array.isArray(error.response?.data?.error) ? error.response?.data?.error.join(", ") : null)
                || "Ocorreu um erro ao salvar o agendamento.";

            toast.error(errorMessage);

            // 🚀 SE HOUVER ERRO DE DUPLICIDADE/CONFLITO, RECARREGA OS HORÁRIOS DISPONÍVEIS NA HORA
            if (error.response?.status === 400) {
                setSelectedTime("");
                fetchHorarios();
            }
        }
    };

    if (cart.length === 0) {
        return (
            <S.EmptyContainer>
                <S.EmptyTitle>Nenhum serviço selecionado...</S.EmptyTitle>
                <GoldBtn onClick={() => navigate("/app")}>Escolher Serviços</GoldBtn>
            </S.EmptyContainer>
        );
    }

    return (
        <S.AgendamentoContainer>

            <S.ContentWrapper>

                <S.BackButton onClick={() => navigate("/app")}>
                    ← Voltar e adicionar mais serviços
                </S.BackButton>

                <S.Title>Finalize seu Agendamento</S.Title>
                <S.Subtitle>
                    Revise seus serviços, escolha seu profissional e o melhor horário.
                </S.Subtitle>

                {/* 1. SEUS SERVIÇOS ATIVOS */}
                <div style={{ marginBottom: 35 }}>
                    <S.SectionTitle>Serviços Escolhidos:</S.SectionTitle>
                    <S.ServicesGrid>
                        {cart.map((service, index) => {
                            const itemKey = service.id ? String(service.id) : `service-${index}`;
                            return (
                                <div key={itemKey}>
                                    <ServiceCard
                                        service={service}
                                        inCart={true}
                                        onToggle={() => toggleService(service)}
                                    />
                                </div>
                            );
                        })}
                    </S.ServicesGrid>
                </div>

                {/* CAMPO: SELEÇÃO DE BARBEIRO */}
                <div style={{ marginBottom: 35 }}>
                    <S.SectionTitle color={C.gold} $ls="1px" $mb="12px">
                        1. Escolha o Profissional
                    </S.SectionTitle>
                    <S.StyledSelect
                        value={selectedBarber}
                        onChange={(e) => setSelectedBarber(e.target.value)}
                        disabled={barbers.length === 0}
                    >
                        {barbers.length > 0 ? (
                            <>
                                <option value="">Selecione um especialista...</option>
                                {barbers.map(barber => (
                                    <option key={barber.id} value={barber.id}>
                                        {barber.name}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="" disabled>
                                Nenhum profissional disponível no momento...
                            </option>
                        )}
                    </S.StyledSelect>
                </div>

                {/* SELEÇÃO DE DATA */}
                <div style={{ marginBottom: 35 }}>
                    <S.SectionTitle color={C.gold} $ls="1px" $mb="12px">
                        2. Escolha o dia
                    </S.SectionTitle>
                    <S.StyledInput
                        type="date"
                        value={selectedDate}
                        min={todayStr}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* PAINEL EXCLUSIVO PARA ADMINISTRADORES/BARBEIROS */}
                {isEmployee && (
                    <S.AdminPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <S.AdminTextWrapper>
                            <S.AdminTitle>👑 Ferramentas de Atendimento Interno</S.AdminTitle>
                            <S.AdminDescription>
                                Caso esteja agendando para um cliente presencial, informe o nome e telefone abaixo. **Se deixar em branco, o agendamento será feito em seu próprio nome.**
                            </S.AdminDescription>
                        </S.AdminTextWrapper>

                        {/* INPUT: NOME DO CLIENTE */}
                        <div style={{ width: '100%' }}>
                            <label style={{ color: C.gold, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                                Nome do Cliente (Opcional):
                            </label>
                            <S.StyledInput
                                type="text"
                                placeholder={`Ex: João Silva (Padrão: ${userInfo?.name || 'Seu Nome'})`}
                                value={customClientName}
                                onChange={(e) => setCustomClientName(e.target.value)}
                            />
                        </div>

                        {/* INPUT: TELEFONE DO CLIENTE */}
                        <div style={{ width: '100%' }}>
                            <label style={{ color: C.gold, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>
                                WhatsApp do Cliente (Opcional):
                            </label>
                            <S.StyledInput
                                type="text"
                                placeholder={`Ex: 32999999999 (Padrão: ${userInfo?.client_phone || 'Seu Telefone'})`}
                                value={customClientPhone}
                                onChange={(e) => setCustomClientPhone(e.target.value)}
                            />
                        </div>

                        {/* CHECKBOX: PLANO MENSAL */}
                        <div style={{ marginTop: '8px' }}>
                            <S.AdminDescription style={{ marginBottom: '8px' }}>
                                **Plano Mensal Recorrente:** Aplica descontos automáticos de Segunda a Quarta.
                            </S.AdminDescription>
                            <S.CheckboxLabel>
                                <S.StyledCheckbox
                                    type="checkbox"
                                    checked={isMonthlyPlan}
                                    onChange={(e) => setIsMonthlyPlan(e.target.checked)}
                                />
                            </S.CheckboxLabel>
                        </div>
                    </S.AdminPanel>
                )}

                {/* SELEÇÃO DE HORÁRIOS */}
                {selectedDate && selectedBarber && (
                    <div style={{ marginBottom: 45 }}>
                        <S.SectionTitle color={C.gold} $ls="1px" $mb="15px">
                            3. Horários Disponíveis para esta Data
                        </S.SectionTitle>

                        {loadingTimes && <S.StatusText>Carregando horários livres do sistema...</S.StatusText>}

                        {!loadingTimes && availableTimes.length === 0 && (
                            <S.StatusText>Nenhuma jornada configurada ou horários esgotados para este dia.</S.StatusText>
                        )}

                        <S.HoursGrid>
                            {!loadingTimes && availableTimes.map(slot => {
                                const active = selectedTime === slot.time;
                                const isavailable = slot.available;

                                return (
                                    <S.HourButton
                                        key={slot.time}
                                        type="button"
                                        disabled={!isavailable}
                                        $active={active}
                                        $isavailable={isavailable}
                                        onClick={() => setSelectedTime(slot.time)}
                                        title={!isavailable ? `Indisponível: ${slot.reason}` : "Horário Livre"}
                                    >
                                        {slot.time}
                                    </S.HourButton>
                                );
                            })}
                        </S.HoursGrid>
                    </div>
                )}

                {/* BOTÃO FINALIZAR */}
                <S.FooterActions>
                    <GoldBtn onClick={handleConfirmarAgendamento}>
                        Confirmar para R$ {Number(total || 0).toFixed(2)} ✦
                    </GoldBtn>
                </S.FooterActions>

            </S.ContentWrapper>
        </S.AgendamentoContainer>
    );
}