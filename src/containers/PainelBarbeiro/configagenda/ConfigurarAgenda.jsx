// src/containers/PainelBarbeiro/ConfigurarAgenda/index.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { api } from "../../../services/api.js";
import { GoldBtn } from "../../../components/buttongold/GoldBtn.jsx";
import {
  Wrapper,
  Card,
  CardTitle,
  CardSubtitle,
  HelperText,
  Form,
  FieldLabel,
  SmallFieldLabel,
  Select,
  Option,
  TimeInput,
  TwoColumnsGrid,
  ActionsColumn,
  DeleteButton,
  Divider,
  BlockedListTitle,
  EmptyBlockedText,
  BlockedList,
  BlockedItem,
  BlockedItemText,
  BlockedItemHighlight,
  ReleaseButton,
  ConfirmToastText,
  ConfirmToastMessage,
  ConfirmToastActions,
  ConfirmToastNoButton,
  ConfirmToastYesButton,
} from "./styles.js";

const DIAS_NOMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// Helper aprimorado para obter o token de qualquer chave utilizada no app
function obterToken() {
  const directToken =
    localStorage.getItem("@Barbearia:token") ||
    localStorage.getItem("barbearia:token") ||
    localStorage.getItem("token");

  if (directToken) return directToken;

  const userData = localStorage.getItem("barbearia:userData");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      return parsed.token || parsed.user?.token || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Helper para obter o ID do barbeiro logado caso a prop venha vazia
function obterBarberIdLogado() {
  const userData = localStorage.getItem("barbearia:userData");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      return parsed.id || parsed.user?.id || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function ConfigurarAgenda({ barberId: barberIdProp, onHorarioSalvo }) {
  const barberIdLogado = obterBarberIdLogado();
  const isAllSelected = !barberIdProp || barberIdProp === "ALL";
  const activeBarberId = isAllSelected ? barberIdLogado : barberIdProp;

  // --- ESTADOS ---
  const [day_of_week, setday_of_week] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("19:00");
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const [blockStart, setBlockStart] = useState("12:00");
  const [blockEnd, setBlockEnd] = useState("13:00");
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const [blockDateOnly, setBlockDateOnly] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  // =================================================================
  // 1. FUNÇÕES DE CARREGAMENTO (Sempre declaradas primeiro)
  // =================================================================

  // 🔄 Carrega as datas pontuais bloqueadas
  const carregarBloqueiosDatas = useCallback(async () => {
    if (!activeBarberId) {
      setBlockedDates([]);
      return;
    }
    try {
      setLoadingDates(true);
      const token = obterToken();
      const response = await api.get(
        `bloqueio-datas?barber_id=${activeBarberId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      setBlockedDates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar bloqueios de datas específicas:", error);
    } finally {
      setLoadingDates(false);
    }
  }, [activeBarberId]);

  // 🔄 Carrega a jornada salva no banco para o DIA selecionado
  const carregarJornadaDoDia = useCallback(async () => {
    if (!activeBarberId) return;
    try {
      setLoadingConfig(true);
      const token = obterToken();
      const response = await api.get(
        `/disponibilidade/todas?barber_id=${activeBarberId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );

      const listas = Array.isArray(response.data) ? response.data : [];
      const configDoDia = listas.find(
        (item) => Number(item.day_of_week) === Number(day_of_week),
      );

      if (configDoDia) {
        setStartTime((configDoDia.start_time || "08:00").slice(0, 5));
        setEndTime((configDoDia.end_time || "19:00").slice(0, 5));
        setIntervalMinutes(Number(configDoDia.interval_minutes) || 30);
      } else {
        setStartTime("08:00");
        setEndTime("19:00");
        setIntervalMinutes(30);
      }
    } catch (error) {
      console.error("Erro ao carregar jornada do dia:", error);
    } finally {
      setLoadingConfig(false);
    }
  }, [activeBarberId, day_of_week]);

  // 🔄 Carrega os bloqueios de horário (ex: almoço)
  const carregarBloqueios = useCallback(async () => {
    if (!activeBarberId) {
      setBlockedSlots([]);
      return;
    }
    try {
      setLoadingBlocks(true);
      const token = obterToken();
      const response = await api.get(
        `bloqueio-horarios?barber_id=${activeBarberId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      const dados = response.data?.blockedSlots || response.data || [];
      setBlockedSlots(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar bloqueios:", error);
      setBlockedSlots([]);
    } finally {
      setLoadingBlocks(false);
    }
  }, [activeBarberId]);

  // =================================================================
  // 2. USE EFFECT ÚNICO (Executa após as funções serem criadas)
  // =================================================================
  useEffect(() => {
    carregarJornadaDoDia();
    carregarBloqueios();
    carregarBloqueiosDatas();
  }, [carregarJornadaDoDia, carregarBloqueios, carregarBloqueiosDatas]);

  // =================================================================
  // 3. FUNÇÕES DE AÇÃO (Salvar, Deletar...)
  // =================================================================

  const handleAdicionarDataBloqueada = async (e) => {
    e.preventDefault();
    if (!activeBarberId) {
      return toast.error("Selecione um barbeiro válido para bloquear datas.");
    }
    if (!blockDateOnly) {
      return toast.error("Selecione uma data válida.");
    }

    try {
      setLoadingDates(true);
      const token = obterToken();
      await api.post(
        "bloqueio-datas",
        {
          barber_id: activeBarberId,
          date: blockDateOnly,
          reason: "Folga ou Feriado",
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      toast.success("Data inteira bloqueada com sucesso!");
      carregarBloqueiosDatas();
      setBlockDateOnly("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao bloquear a data.");
    } finally {
      setLoadingDates(false);
    }
  };

  const handleDeletarDataBloqueada = async (id) => {
    try {
      const token = obterToken();
      await api.delete(`bloqueio-datas/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Data liberada com sucesso! 🎉");
      carregarBloqueiosDatas();
    } catch (error) {
      toast.error("Erro ao liberar a data.");
    }
  };

  const handleSalvarAgenda = async (e) => {
    e.preventDefault();
    if (!activeBarberId) {
      return toast.error(
        "Selecione um barbeiro válido para configurar a agenda.",
      );
    }
    if (startTime >= endTime) {
      return toast.error(
        "A hora de entrada deve ser menor que a hora de saída!",
      );
    }

    const dados = {
      barber_id: activeBarberId,
      day_of_week: Number(day_of_week),
      start_time: `${startTime}:00`,
      end_time: `${endTime}:00`,
      interval_minutes: Number(intervalMinutes),
    };

    try {
      setLoading(true);
      const token = obterToken();
      await api.post("/disponibilidade", dados, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Agenda salva/atualizada com sucesso!");
      await carregarJornadaDoDia();
      if (onHorarioSalvo) onHorarioSalvo();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Erro ao atualizar a jornada de trabalho.",
      );
    } finally {
      setLoading(false);
    }
  };

  const executarExclusaoAgenda = async (nomeDoDia) => {
    if (!activeBarberId) {
      return toast.error("Selecione um barbeiro válido para excluir a agenda.");
    }
    try {
      setLoading(true);
      const token = obterToken();
      await api.delete(`/disponibilidade`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { barber_id: activeBarberId, day_of_week: Number(day_of_week) },
      });
      toast.success(`Agenda de ${nomeDoDia} removida com sucesso! 🗑️`);
      setStartTime("08:00");
      setEndTime("19:00");
      setIntervalMinutes(30);
      await carregarJornadaDoDia();
      if (onHorarioSalvo) onHorarioSalvo();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Erro ao excluir os horários deste dia.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirAgenda = () => {
    const nomeDoDia = DIAS_NOMES[Number(day_of_week)];
    const ConfirmacaoToast = ({ closeToast }) => (
      <ConfirmToastText>
        <ConfirmToastMessage>
          Tem certeza que deseja apagar <strong>TODOS</strong> os horários de{" "}
          <strong>{nomeDoDia}</strong>?
        </ConfirmToastMessage>
        <ConfirmToastActions>
          <ConfirmToastNoButton onClick={closeToast}>Não</ConfirmToastNoButton>
          <ConfirmToastYesButton
            onClick={() => {
              executarExclusaoAgenda(nomeDoDia);
              closeToast();
            }}
          >
            Sim, Limpar 🗑️
          </ConfirmToastYesButton>
        </ConfirmToastActions>
      </ConfirmToastText>
    );

    toast.info(<ConfirmacaoToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      theme: "dark",
    });
  };

  const handleAdicionarBloqueio = async (e) => {
    e.preventDefault();
    if (!activeBarberId) {
      return toast.error(
        "Selecione um barbeiro válido para bloquear horários.",
      );
    }
    if (blockStart >= blockEnd) {
      return toast.error(
        "A hora de início do bloqueio deve ser menor que a hora de término!",
      );
    }

    const dadosBloqueio = {
      barber_id: activeBarberId,
      day_of_week: Number(day_of_week),
      start_time: `${blockStart}:00`,
      end_time: `${blockEnd}:00`,
    };

    try {
      setLoadingBlocks(true);
      const token = obterToken();
      await api.post("bloqueio-horarios", dadosBloqueio, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Intervalo bloqueado com sucesso!");
      carregarBloqueios();
    } catch (error) {
      toast.error("Erro ao bloquear este intervalo.");
    } finally {
      setLoadingBlocks(false);
    }
  };

  const handleDeletarBloqueio = async (id) => {
    try {
      const token = obterToken();
      await api.delete(`bloqueio-horarios/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Horário liberado com sucesso! 🎉");
      carregarBloqueios();
    } catch (error) {
      toast.error("Erro ao liberar o horário.");
    }
  };

  return (
    <Wrapper>
      <Card>
        <CardTitle>⚙️ Configurar Meu Horário</CardTitle>

        <Form onSubmit={handleSalvarAgenda}>
          <div>
            <FieldLabel>Dia da Semana:</FieldLabel>
            <Select
              value={day_of_week}
              onChange={(e) => setday_of_week(Number(e.target.value))}
              disabled={loadingConfig}
            >
              <Option value={1}>Segunda-feira</Option>
              <Option value={2}>Terça-feira</Option>
              <Option value={3}>Quarta-feira</Option>
              <Option value={4}>Quinta-feira</Option>
              <Option value={5}>Sexta-feira</Option>
              <Option value={6}>Sábado</Option>
              <Option value={0}>Domingo</Option>
            </Select>
          </div>

          <TwoColumnsGrid>
            <div>
              <SmallFieldLabel>Hora de Entrada:</SmallFieldLabel>
              <TimeInput
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={loadingConfig}
              />
            </div>
            <div>
              <SmallFieldLabel>Hora de Saída:</SmallFieldLabel>
              <TimeInput
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={loadingConfig}
              />
            </div>
          </TwoColumnsGrid>

          <div>
            <FieldLabel>Tempo por Corte (minutos):</FieldLabel>
            <Select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              disabled={loadingConfig}
            >
              <Option value={30}>30 minutos</Option>
              <Option value={45}>45 minutos</Option>
              <Option value={60}>1 hora</Option>
            </Select>
          </div>

          <ActionsColumn>
            <GoldBtn type="submit" disabled={loading || loadingConfig}>
              {loading ? "A guardar..." : "Atualizar Agenda ✦"}
            </GoldBtn>

            <DeleteButton
              type="button"
              onClick={handleExcluirAgenda}
              disabled={loading || loadingConfig}
            >
              {loading
                ? "Processando..."
                : "Folga / Excluir Horários Deste Dia 🗑️"}
            </DeleteButton>
          </ActionsColumn>
        </Form>
      </Card>

      <Card>
        <CardSubtitle>🔒 Bloquear Janela de Horário</CardSubtitle>
        <HelperText>
          Defina intervalos em que você <strong>não</strong> estará disponível
          (Ex: Almoço, Curso).
        </HelperText>

        <Form onSubmit={handleAdicionarBloqueio}>
          <TwoColumnsGrid>
            <div>
              <SmallFieldLabel>Início do Bloqueio:</SmallFieldLabel>
              <TimeInput
                type="time"
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
              />
            </div>
            <div>
              <SmallFieldLabel>Fim do Bloqueio:</SmallFieldLabel>
              <TimeInput
                type="time"
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
              />
            </div>
          </TwoColumnsGrid>

          <GoldBtn
            type="submit"
            disabled={loadingBlocks}
            style={{ padding: "10px", fontSize: 14 }}
          >
            {loadingBlocks
              ? "Salvando..."
              : `Bloquear neste (${DIAS_NOMES[Number(day_of_week)]}) 🚫`}
          </GoldBtn>
        </Form>

        <Divider />

        <BlockedListTitle>Janelas Bloqueadas Ativas</BlockedListTitle>

        {blockedSlots.length === 0 ? (
          <EmptyBlockedText>
            Nenhum intervalo bloqueado cadastrado.
          </EmptyBlockedText>
        ) : (
          <BlockedList>
            {blockedSlots.map((block) => (
              <BlockedItem key={block.id}>
                <BlockedItemText>
                  <BlockedItemHighlight>
                    {DIAS_NOMES[block.day_of_week ?? 1]}
                  </BlockedItemHighlight>
                  {" - "}
                  <BlockedItemHighlight>
                    {(block.start_time || "00:00").slice(0, 5)} até{" "}
                    {(block.end_time || "00:00").slice(0, 5)}
                  </BlockedItemHighlight>
                </BlockedItemText>
                <ReleaseButton
                  type="button"
                  onClick={() => handleDeletarBloqueio(block.id)}
                >
                  Liberar 🔓
                </ReleaseButton>
              </BlockedItem>
            ))}
          </BlockedList>
        )}
      </Card>

      <Card style={{ marginTop: "20px" }}>
        <CardSubtitle>🏖️ Bloquear Dia Inteiro (Feriados/Folgas)</CardSubtitle>
        <HelperText>
          Feche a agenda para um dia completo do calendário. Clientes não verão
          nenhum horário.
        </HelperText>

        <Form onSubmit={handleAdicionarDataBloqueada}>
          <div>
            <SmallFieldLabel>Selecionar Data:</SmallFieldLabel>
            <TimeInput
              type="date"
              value={blockDateOnly}
              onChange={(e) => setBlockDateOnly(e.target.value)}
              disabled={loadingDates}
            />
          </div>

          <GoldBtn
            type="submit"
            disabled={loadingDates}
            style={{ padding: "10px", fontSize: 14 }}
          >
            {loadingDates ? "Processando..." : "Bloquear Data 🚫"}
          </GoldBtn>
        </Form>

        <Divider />

        <BlockedListTitle>Datas Bloqueadas Ativas</BlockedListTitle>

        {blockedDates.length === 0 ? (
          <EmptyBlockedText>Nenhuma data especial bloqueada.</EmptyBlockedText>
        ) : (
          <BlockedList>
            {blockedDates.map((block) => {
              const [ano, mes, dia] = block.date.split("-");
              return (
                <BlockedItem key={block.id}>
                  <BlockedItemText>
                    <BlockedItemHighlight>
                      📅 {dia}/{mes}/{ano}
                    </BlockedItemHighlight>
                  </BlockedItemText>
                  <ReleaseButton
                    type="button"
                    onClick={() => handleDeletarDataBloqueada(block.id)}
                  >
                    Liberar 🔓
                  </ReleaseButton>
                </BlockedItem>
              );
            })}
          </BlockedList>
        )}
      </Card>
    </Wrapper>
  );
}

export default ConfigurarAgenda;
