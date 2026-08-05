import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { C, font } from "../../constants/theme.js";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ConfigurarAgenda } from "../PainelBarbeiro/configagenda/ConfigurarAgenda.jsx";
import { MeusAgendamentos } from "../PainelBarbeiro/agendamentos/MeusAgendamentos.jsx";
import { useUser } from "../../hooks/userContext.jsx";

export function PainelBarbeiro() {
    const { userInfo } = useUser();
    const barberId = userInfo?.id;

    return (
        <div
            style={{ minHeight: "100vh", background: "#111", padding: "100px 20px" }}
        >
            <ConfigurarAgenda barberId={barberId} />
            <MeusAgendamentos barberId={barberId} />
        </div>
    );
}

export function AgendaBarbeiro() {
    const { userInfo } = useUser();
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd"),
    );
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    // ESTADOS PARA O CONTROLE DO ADMINISTRADOR
    const [barbeiros, setBarbeiros] = useState([]);
    const [selectedBarberId, setSelectedBarberId] = useState(""); // "" significa "Todos os Barbeiros"

    const isAdmin = userInfo?.admin === true || userInfo?.role === "admin";

    // 1. Efeito para carregar os barbeiros se for administrador
    useEffect(() => {
        async function carregarBarbeiros() {
            if (!isAdmin) return;
            try {
                const response = await api.get("/barbers", { withCredentials: true });
                setBarbeiros(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Erro ao carregar lista de barbeiros na Agenda:");
            }
        }
        carregarBarbeiros();
    }, [isAdmin]);

    // 2. Recarrega a agenda sempre que mudar a data OU o barbeiro selecionado
    useEffect(() => {
        async function loadAgenda() {
            try {
                setLoading(true);

                // Monta a URL base com a data
                let url = `/dashboard?date=${selectedDate}`;

                // Se for admin e houver um barbeiro específico selecionado, envia o ID
                if (isAdmin && selectedBarberId) {
                    url += `&barber_id=${selectedBarberId}`;
                }

                const response = await api.get(url, { withCredentials: true });
                setAgenda(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar a agenda:");
                toast.error("Não foi possível carregar os agendamentos desta data.");
            } finally {
                setLoading(false);
            }
        }

        if (selectedDate) {
            loadAgenda();
        }
    }, [selectedDate, selectedBarberId, isAdmin]);

    return (
        <div
            style={{
                background: C.bg || "#111",
                minHeight: "100vh",
                color: C.white || "#fff",
                padding: "120px 20px 40px",
            }}
        >
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: 30,
                        flexWrap: "wrap",
                        gap: 20,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontFamily: font.display,
                                color: C.gold || "#d4af37",
                                fontSize: 32,
                                marginBottom: 5,
                            }}
                        >
                            Sua Agenda de Atendimentos
                        </h2>
                        <p
                            style={{
                                color: C.muted || "#888",
                                fontFamily: font.body,
                                fontSize: 16,
                            }}
                        >
                            Gerencie seus clientes filtrando por qualquer dia do calendário.
                        </p>
                    </div>

                    {/* Filtros Inteligentes (Alinhados Lado a Lado se couber na tela) */}
                    <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
                        {/* FILTRO SELECT: Visível exclusivamente para o Admin */}
                        {isAdmin && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label
                                    style={{
                                        fontFamily: font.body,
                                        fontSize: 14,
                                        color: C.gold || "#d4af37",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Filtrar por Profissional:
                                </label>
                                <select
                                    value={selectedBarberId}
                                    onChange={(e) => setSelectedBarberId(e.target.value)}
                                    style={{
                                        background: C.card || "#222",
                                        color: "#fff",
                                        border: `1px solid ${C.gold || "#d4af37"}`,
                                        borderRadius: 8,
                                        padding: "10px 15px",
                                        fontSize: 16,
                                        outline: "none",
                                        fontFamily: font.body,
                                        cursor: "pointer",
                                        height: "46px",
                                    }}
                                >
                                    <option value="">👥 Todos os Barbeiros</option>
                                    <option value={userInfo?.id}>Meu Painel Pessoal</option>
                                    {barbeiros.map((barber) => (
                                        <option key={barber.id} value={barber.id}>
                                            {barber.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label
                                style={{
                                    fontFamily: font.body,
                                    fontSize: 14,
                                    color: C.gold || "#d4af37",
                                    fontWeight: "bold",
                                }}
                            >
                                Filtrar por Dia:
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    background: C.card || "#222",
                                    color: "#fff",
                                    border: `1px solid ${C.gold || "#d4af37"}`,
                                    borderRadius: 8,
                                    padding: "10px 15px",
                                    fontSize: 16,
                                    outline: "none",
                                    fontFamily: font.body,
                                    cursor: "pointer",
                                    height: "46px",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {loading && (
                    <p style={{ color: C.text || "#fff", fontFamily: font.body }}>
                        Buscando marcações no banco de dados...
                    </p>
                )}

                {!loading && agenda.length === 0 && (
                    <div
                        style={{
                            background: C.card || "#222",
                            padding: "40px 20px",
                            borderRadius: 12,
                            border: `1px solid ${C.border || "#333"}`,
                            textAlign: "center",
                        }}
                    >
                        <p style={{ color: C.muted, fontFamily: font.body, fontSize: 16 }}>
                            Nenhum cliente agendado para o dia{" "}
                            {selectedDate.split("-").reverse().join("/")}.
                        </p>
                    </div>
                )}

                {!loading && agenda.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {agenda.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: C.card || "#222",
                                    borderLeft: `5px solid ${C.gold || "#d4af37"}`,
                                    borderTop: `1px solid ${C.border || "#333"}`,
                                    borderRight: `1px solid ${C.border || "#333"}`,
                                    borderBottom: `1px solid ${C.border || "#333"}`,
                                    borderRadius: "0 12px 12px 0",
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div>
                                    <span
                                        style={{
                                            background: "rgba(212, 175, 55, 0.1)",
                                            color: C.gold || "#d4af37",
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                            fontSize: 14,
                                            fontWeight: "700",
                                            fontFamily: font.body,
                                        }}
                                    >
                                        {item.appointment_time?.slice(0, 5) || "00:00"} h
                                    </span>

                                    <h3
                                        style={{
                                            fontFamily: font.display,
                                            color: C.text || "#fff",
                                            fontSize: 20,
                                            marginTop: 10,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.client_name}
                                    </h3>

                                    <p
                                        style={{
                                            color: C.muted,
                                            fontFamily: font.body,
                                            fontSize: 14,
                                        }}
                                    >
                                        ✦ <strong>Serviço:</strong> {item.service_name}
                                    </p>

                                    {/* Exibe o nome do barbeiro caso esteja no modo "Todos os Barbeiros" */}
                                    {!selectedBarberId && item.barber_name && (
                                        <p
                                            style={{
                                                color: C.gold || "#d4af37",
                                                fontFamily: font.body,
                                                fontSize: 12,
                                                marginTop: 4,
                                            }}
                                        >
                                            <strong>Profissional:</strong> {item.barber_name}
                                        </p>
                                    )}
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <p
                                        style={{
                                            color: C.muted,
                                            fontFamily: font.body,
                                            fontSize: 13,
                                            marginBottom: 5,
                                        }}
                                    >
                                        {item.client_phone}
                                    </p>
                                    <span
                                        style={{
                                            color: "#4BB543",
                                            fontWeight: "600",
                                            fontSize: 13,
                                            fontFamily: font.body,
                                        }}
                                    >
                                        ● Agendado
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
