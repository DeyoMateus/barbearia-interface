import React, { useState, useEffect } from "react";
import { ConfigurarAgenda } from "./configagenda/ConfigurarAgenda.jsx";
import { MeusAgendamentos } from "./agendamentos/MeusAgendamentos.jsx";
import { useUser } from "../../hooks/userContext";
import { api } from "../../services/api";

import * as S from "./styles";

export function PainelBarbeiro() {
  const { userInfo, loading: loadingUser } = useUser(); // Pega dados direto do Contexto autenticado

  const myId = userInfo?.id;
  const isAdmin = userInfo?.admin === true || userInfo?.role === "admin";

  // Inicia sempre em "ALL" para não abrir a configuração direto
  const [selectedBarberId, setSelectedBarberId] = useState("ALL");
  const [barbeirosLista, setBarbeirosLista] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function carregarBarbeiros() {
      if (isAdmin) {
        try {
          const response = await api.get("/barbers", { withCredentials: true });
          setBarbeirosLista(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
          console.error("Erro ao buscar lista de barbeiros:");
        }
      }
    }


    carregarBarbeiros();
  }, [isAdmin]);

  const atualizarTabela = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loadingUser) {
    return <S.LoadingContainer>✦ Carregando painel...</S.LoadingContainer>;
  }

  if (!myId) {
    return (
      <S.AccessDeniedContainer>
        <S.AccessDeniedTitle>Acesso negado.</S.AccessDeniedTitle>
        <S.AccessDeniedSub>
          Não identificamos sua sessão. Faça login novamente para acessar o painel.
        </S.AccessDeniedSub>
      </S.AccessDeniedContainer>
    );
  }

  return (
    <S.Container>
      {/* SELETOR DE VISÃO DA AGENDA (Exclusivo Admin) */}
      {isAdmin && (
        <S.FilterCard>
          <S.FilterLabel>
            Filtrar Visão do Painel por Colaborador:
          </S.FilterLabel>
          <S.SelectInput
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
          >
            <option value="ALL">-- Ver Geral (Todos os Barbeiros) --</option>
            {barbeirosLista.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name} {barber.id === myId ? "(Você)" : ""}
              </option>
            ))}
          </S.SelectInput>
        </S.FilterCard>
      )}

      {/* Só exibe a configuração se um barbeiro individual for selecionado */}
      {selectedBarberId && selectedBarberId !== "ALL" && (
        <>
          <ConfigurarAgenda
            barberId={selectedBarberId}
            onHorarioSalvo={atualizarTabela}
          />
          <S.Divider />
        </>
      )}

      {/* Compromissos da agenda */}
      <MeusAgendamentos
        barberId={selectedBarberId}
        refreshTrigger={refreshTrigger}
      />
    </S.Container>
  );
}