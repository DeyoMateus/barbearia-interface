// src/containers/MenuAdmin/ListagemAdmin/index.jsx
import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { toast } from "react-toastify";

import {
    Container,
    MenuNav,
    NavButton,
    TableWrapper,
    Table,
    Th,
    ThCenter,
    Td,
    TdCenter,
    ActionButton,
    ReportForm,
    FieldGroup,
    FieldLabel,
    DateInput,
    SubmitReportButton,
    CardGrid,
    Card,
    CardTitle,
    CardValue,
    ExportButton,
    ModalOverlay,
    ModalContent,
    ModalTitle,
    InputGroup,
    InputLabel,
    ModalInput,
    ModalSelect,
    ModalActions,
    ModalCancelButton,
    ModalSaveButton,
    LoadingText,
} from "./styles.js";

export function ListagemAdmin() {
    const [subAba, setSubAba] = useState("barbeiros");
    const [loading, setLoading] = useState(false);

    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [relatorio, setRelatorio] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [itemParaEditar, setItemParaEditar] = useState(null);
    const [formEdicao, setFormEdicao] = useState({});

    // Envolvido em useCallback para evitar problemas de ciclo no useEffect
    const carregarDados = useCallback(async () => {
        setLoading(true);
        try {
            if (subAba === "barbeiros") {
                const response = await api.get("/barbers");
                setBarbeiros(response.data || []);
            } else if (subAba === "servicos") {
                const response = await api.get("/services");
                setServicos(response.data || []);
            } else if (subAba === "categorias") {
                const response = await api.get("/categories/service");
                const lista = response.data?.categories || response.data || [];
                setCategorias(lista);
            }
        } catch (error) {
            console.error(`Erro ao buscar dados da aba ${subAba}:`);
            toast.error("Erro ao carregar dados da listagem.");
        } finally {
            setLoading(false);
        }
    }, [subAba]);

    useEffect(() => {
        if (subAba !== "relatorios") {
            carregarDados();
        }
    }, [subAba, carregarDados]);

    const handleExcluirItem = (tipo, id) => {
        // Exibe um toast interativo para confirmar a exclusão
        toast.warn(
            <div>
                <p style={{ marginBottom: "8px" }}>Tem certeza que deseja excluir?</p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            confirmarExclusao(tipo, id);
                        }}
                        style={{
                            background: "#d32f2f",
                            color: "#fff",
                            border: "none",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Sim
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        style={{
                            background: "#666",
                            color: "#fff",
                            border: "none",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Não
                    </button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    const confirmarExclusao = async (tipo, id) => {
        try {
            if (tipo === "barbeiros") {
                await api.delete(`/barbers/${id}`);
                setBarbeiros((prev) => prev.filter((b) => b.id !== id));
            } else if (tipo === "servicos") {
                await api.delete(`/services/${id}`);
                setServicos((prev) => prev.filter((s) => s.id !== id));
            } else if (tipo === "categorias") {
                await api.delete(`/categories/${id}`);
                setCategorias((prev) => prev.filter((c) => c.id !== id));
            }
            toast.success("Removido com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar:");
            toast.error(error.response?.data?.error || "Erro ao tentar excluir.");
        }
    };

    const abrirModalEdicao = (tipo, item) => {
        setItemParaEditar({ tipo, data: item });
        setFormEdicao({ ...item });
        setModalAberto(true);
    };

    const handleSalvarEdicao = async (e) => {
        e.preventDefault();
        const { tipo, data } = itemParaEditar;

        try {
            if (tipo === "barbeiros") {
                await api.put(`/barbers/${data.id}`, {
                    name: formEdicao.name,
                    email: formEdicao.email,
                    client_phone: formEdicao.client_phone,
                });
            } else if (tipo === "servicos") {
                await api.put(`/services/${data.id}`, {
                    name: formEdicao.name,
                    price: Number(formEdicao.price),
                    is_monthly_offer: Boolean(formEdicao.is_monthly_offer),
                    discount_percentage: Number(formEdicao.discount_percentage || 0),
                });
            } else if (tipo === "categorias") {
                await api.put(`/categories/${data.id}`, { name: formEdicao.name });
            }

            toast.success("Dados atualizados com sucesso!");
            setModalAberto(false);
            carregarDados();
        } catch (error) {
            console.error("Erro ao editar:");
            toast.error(error.response?.data?.error || "Erro ao salvar alterações.");
        }
    };

    const handleBuscarRelatorio = async (e) => {
        e.preventDefault();
        if (!dataInicio || !dataFim) return;
        setLoading(true);
        try {
            // 
            const response = await api.get("/financial", {
                params: { startDate: dataInicio, endDate: dataFim },
            });

            setRelatorio(response.data);
            toast.success("Balanço financeiro atualizado!");
        } catch (error) {
            console.error("Erro ao buscar balanço financeiro:");
            toast.error("Erro ao calcular balanço.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportarCSV = async () => {
        if (!dataInicio || !dataFim) return;
        try {
            const response = await api.get("/financial/export", {
                params: { startDate: dataInicio, endDate: dataFim },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `faturamento_${dataInicio}_a_${dataFim}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Planilha baixada!");
        } catch (error) {
            console.error("Erro ao baixar CSV:");
            toast.error("Falha ao exportar planilha.");
        }
    };

    return (
        <Container>
            <MenuNav>
                <NavButton type="button" $active={subAba === "barbeiros"} onClick={() => setSubAba("barbeiros")}>
                    Barbeiros
                </NavButton>
                <NavButton type="button" $active={subAba === "servicos"} onClick={() => setSubAba("servicos")}>
                    Serviços
                </NavButton>
                <NavButton type="button" $active={subAba === "categorias"} onClick={() => setSubAba("categorias")}>
                    Categorias
                </NavButton>
                <NavButton type="button" $active={subAba === "relatorios"} onClick={() => setSubAba("relatorios")}>
                    📈 Financeiro
                </NavButton>
            </MenuNav>

            {loading && <LoadingText>Carregando informações...</LoadingText>}

            {!loading && subAba === "barbeiros" && (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Nome do Profissional</Th>
                                <Th>E-mail</Th>
                                <ThCenter>Ações</ThCenter>
                            </tr>
                        </thead>
                        <tbody>
                            {barbeiros.map((b) => (
                                <tr key={b.id}>
                                    <Td>{b.name}</Td>
                                    <Td>{b.email}</Td>
                                    <TdCenter>
                                        <ActionButton $variant="editar" onClick={() => abrirModalEdicao("barbeiros", b)}>
                                            Editar
                                        </ActionButton>
                                        <ActionButton $variant="excluir" onClick={() => handleExcluirItem("barbeiros", b.id)}>
                                            Excluir
                                        </ActionButton>
                                    </TdCenter>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            )}

            {!loading && subAba === "servicos" && (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Serviço</Th>
                                <Th>Preço Base</Th>
                                <Th>Oferta Mensal</Th>
                                <ThCenter>Ações</ThCenter>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.map((s) => (
                                <tr key={s.id}>
                                    <Td>{s.name}</Td>
                                    <Td>R$ {Number(s.price).toFixed(2)}</Td>
                                    <Td>{s.is_monthly_offer ? `${Number(s.discount_percentage)}% OFF` : "Não"}</Td>
                                    <TdCenter>
                                        <ActionButton $variant="editar" onClick={() => abrirModalEdicao("servicos", s)}>
                                            Editar
                                        </ActionButton>
                                        <ActionButton $variant="excluir" onClick={() => handleExcluirItem("servicos", s.id)}>
                                            Excluir
                                        </ActionButton>
                                    </TdCenter>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            )}

            {!loading && subAba === "categorias" && (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Nome da Categoria</Th>
                                <Th>Qtd. Serviços Vinculados</Th>
                                <ThCenter>Ações</ThCenter>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((c) => (
                                <tr key={c.id}>
                                    <Td>{c.name}</Td>
                                    <Td>{c.services ? c.services.length : 0} serviços</Td>
                                    <TdCenter>
                                        <ActionButton $variant="editar" onClick={() => abrirModalEdicao("categorias", c)}>
                                            Editar
                                        </ActionButton>
                                        <ActionButton $variant="excluir" onClick={() => handleExcluirItem("categorias", c.id)}>
                                            Excluir
                                        </ActionButton>
                                    </TdCenter>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            )}

            {subAba === "relatorios" && (
                <div>
                    <ReportForm onSubmit={handleBuscarRelatorio}>
                        <FieldGroup>
                            <FieldLabel>Data de Início</FieldLabel>
                            <DateInput type="date" required value={dataInicio || ""} onChange={(e) => setDataInicio(e.target.value)} />
                        </FieldGroup>
                        <FieldGroup>
                            <FieldLabel>Data de Término</FieldLabel>
                            <DateInput type="date" required value={dataFim || ""} onChange={(e) => setDataFim(e.target.value)} />
                        </FieldGroup>
                        <SubmitReportButton type="submit" disabled={loading}>
                            {loading ? "Calculando..." : "Filtrar Balanço"}
                        </SubmitReportButton>
                    </ReportForm>

                    {relatorio && (
                        <div>
                            <CardGrid>
                                <Card>
                                    <CardTitle>Atendimentos Realizados</CardTitle>
                                    <CardValue>{relatorio.serviços?.total_atendimentos || 0}</CardValue>
                                </Card>
                                <Card>
                                    <CardTitle>Cancelamentos</CardTitle>
                                    <CardValue style={{ color: "#e53935" }}>
                                        {relatorio.serviços?.cancelados || 0}
                                    </CardValue>
                                </Card>
                                <Card>
                                    <CardTitle>Faturamento em Serviços</CardTitle>
                                    <CardValue>R$ {Number(relatorio.serviços?.faturamento_servicos || 0).toFixed(2).replace(".", ",")}</CardValue>
                                </Card>
                                {relatorio.produtos && (
                                    <Card>
                                        <CardTitle>Faturamento em Produtos</CardTitle>
                                        <CardValue>R$ {Number(relatorio.produtos?.faturamento_produtos || 0).toFixed(2).replace(".", ",")}</CardValue>
                                    </Card>
                                )}
                                <Card $highlight>
                                    <CardTitle $highlight>Faturamento Absoluto</CardTitle>
                                    <CardValue $large>R$ {Number(relatorio.faturamento_absoluto_barbearia || 0).toFixed(2).replace(".", ",")}</CardValue>
                                </Card>
                            </CardGrid>

                            <ExportButton type="button" onClick={handleExportarCSV}>
                                📥 Baixar Relatório Completo em Planilha (.CSV)
                            </ExportButton>
                        </div>
                    )}
                </div>
            )}

            {modalAberto && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>Editar {itemParaEditar?.tipo.toUpperCase()}</ModalTitle>

                        <form onSubmit={handleSalvarEdicao}>
                            {itemParaEditar?.tipo === "barbeiros" && (
                                <>
                                    <InputGroup>
                                        <InputLabel>Nome</InputLabel>
                                        <ModalInput type="text" required value={formEdicao.name || ""} onChange={(e) => setFormEdicao({ ...formEdicao, name: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLabel>E-mail</InputLabel>
                                        <ModalInput type="email" required value={formEdicao.email || ""} onChange={(e) => setFormEdicao({ ...formEdicao, email: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLabel>Telefone</InputLabel>
                                        <ModalInput type="text" value={formEdicao.client_phone || ""} onChange={(e) => setFormEdicao({ ...formEdicao, client_phone: e.target.value })} />
                                    </InputGroup>
                                </>
                            )}

                            {itemParaEditar?.tipo === "servicos" && (
                                <>
                                    <InputGroup>
                                        <InputLabel>Nome do Serviço</InputLabel>
                                        <ModalInput type="text" required value={formEdicao.name || ""} onChange={(e) => setFormEdicao({ ...formEdicao, name: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLabel>Preço Base (R$)</InputLabel>
                                        <ModalInput type="number" step="0.01" required value={formEdicao.price || ""} onChange={(e) => setFormEdicao({ ...formEdicao, price: e.target.value })} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLabel>Oferta Mensal Ativa?</InputLabel>
                                        <ModalSelect
                                            value={String(formEdicao.is_monthly_offer)}
                                            onChange={(e) => setFormEdicao({ ...formEdicao, is_monthly_offer: e.target.value === "true" })}
                                        >
                                            <option value="false">Não</option>
                                            <option value="true">Sim</option>
                                        </ModalSelect>
                                    </InputGroup>
                                    {Boolean(formEdicao.is_monthly_offer) && (
                                        <InputGroup>
                                            <InputLabel>Porcentagem de Desconto (%)</InputLabel>
                                            <ModalInput type="number" min="0" max="100" value={formEdicao.discount_percentage || ""} onChange={(e) => setFormEdicao({ ...formEdicao, discount_percentage: e.target.value })} />
                                        </InputGroup>
                                    )}
                                </>
                            )}

                            {itemParaEditar?.tipo === "categorias" && (
                                <InputGroup>
                                    <InputLabel>Nome da Categoria</InputLabel>
                                    <ModalInput type="text" required value={formEdicao.name || ""} onChange={(e) => setFormEdicao({ ...formEdicao, name: e.target.value })} />
                                </InputGroup>
                            )}

                            <ModalActions>
                                <ModalCancelButton type="button" onClick={() => setModalAberto(false)}>Cancelar</ModalCancelButton>
                                <ModalSaveButton type="submit">Salvar</ModalSaveButton>
                            </ModalActions>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}