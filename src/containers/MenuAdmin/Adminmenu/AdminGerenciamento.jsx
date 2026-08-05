// src/containers/MenuAdmin/AdminGerenciamento/index.jsx
import React, { useState, useEffect } from "react";
import { api } from "../../../services/api.js";

import {
    Container,
    Title,
    TabsWrapper,
    TabButton,
    Message,
    Form,
    Input,
    Select,
    CheckboxLabel,
    SubmitButton,
} from "./styles.js";

export function AdminGerenciamento({ onBarberCreated }) {
    const [abaAtiva, setAbaAtiva] = useState("barbeiro");
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [categorias, setCategorias] = useState([]);

    const [serviceForm, setServiceForm] = useState({
        name: "",
        price: "",
        category_id: "",
        is_monthly_offer: false,
        discount_percentage: "",
    });

    const [barberForm, setBarberForm] = useState({ name: "", email: "", password: "", client_phone: "" });
    const [categoryForm, setCategoryForm] = useState({ name: "" });

    async function loadCategories() {
        try {
            const response = await api.get("/categories/service");
            const listaCategorias = response.data?.categories || response.data || [];
            setCategorias(Array.isArray(listaCategorias) ? listaCategorias : []);
        } catch (error) {
            console.error("Erro ao carregar categorias para o select:");
            setCategorias([]);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreateBarber = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            await api.post("/barbers", {
                name: barberForm.name,
                email: barberForm.email,
                password: barberForm.password,
                client_phone: barberForm.client_phone,
                role: "barber",
            });

            setMensagem({ tipo: "sucesso", texto: "Barbeiro cadastrado com sucesso!" });
            setBarberForm({ name: "", email: "", password: "", client_phone: "" });

            await loadCategories();
            if (onBarberCreated) {
                onBarberCreated();
            }
        } catch (error) {
            setMensagem({ tipo: "erro", texto: error.response?.data?.error || "Erro ao criar barbeiro." });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ tipo: "", texto: "" });

        try {
            await api.post("/categories", { name: categoryForm.name });
            setMensagem({ tipo: "sucesso", texto: "Categoria criada com sucesso!" });
            setCategoryForm({ name: "" });
            await loadCategories();
        } catch (error) {
            setMensagem({ tipo: "erro", texto: error.response?.data?.error || "Erro ao criar categoria." });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/services", {
                name: serviceForm.name,
                price: Number(serviceForm.price),
                category_id: serviceForm.category_id,
                is_monthly_offer: serviceForm.is_monthly_offer,
                discount_percentage: serviceForm.is_monthly_offer ? Number(serviceForm.discount_percentage) : 0,
            });

            setMensagem({ tipo: "sucesso", texto: "Serviço criado com sucesso!" });
            setServiceForm({ name: "", price: "", category_id: "", is_monthly_offer: false, discount_percentage: "" });

            await loadCategories();
        } catch (error) {
            setMensagem({ tipo: "erro", texto: error.response?.data?.error || "Erro ao criar serviço." });
        } finally {
            setLoading(false);
        }
    };

    function trocarAba(aba) {
        setAbaAtiva(aba);
        setMensagem({ tipo: "", texto: "" });
    }

    return (
        <Container>
            <Title>Painel Administrativo</Title>

            <TabsWrapper>
                <TabButton type="button" $active={abaAtiva === "barbeiro"} onClick={() => trocarAba("barbeiro")}>
                    Novo Barbeiro
                </TabButton>
                <TabButton type="button" $active={abaAtiva === "categoria"} onClick={() => trocarAba("categoria")}>
                    Nova Categoria
                </TabButton>
                <TabButton type="button" $active={abaAtiva === "servico"} onClick={() => trocarAba("servico")}>
                    Novo Serviço
                </TabButton>
            </TabsWrapper>

            {mensagem.texto && <Message $type={mensagem.tipo}>{mensagem.texto}</Message>}

            {abaAtiva === "barbeiro" && (
                <Form onSubmit={handleCreateBarber}>
                    <Input
                        type="text"
                        placeholder="Nome completo do Barbeiro"
                        required
                        value={barberForm.name}
                        onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Número de Telefone"
                        required
                        value={barberForm.client_phone}
                        onChange={(e) => setBarberForm({ ...barberForm, client_phone: e.target.value })}
                    />
                    <Input
                        type="email"
                        autoComplete="username"
                        placeholder="E-mail exclusivo de acesso"
                        required
                        value={barberForm.email}
                        onChange={(e) => setBarberForm({ ...barberForm, email: e.target.value })}
                    />
                    <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Senha provisória"
                        required
                        value={barberForm.password}
                        onChange={(e) => setBarberForm({ ...barberForm, password: e.target.value })}
                    />
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar Perfil de Barbeiro"}
                    </SubmitButton>
                </Form>
            )}

            {abaAtiva === "categoria" && (
                <Form onSubmit={handleCreateCategory}>
                    <Input
                        type="text"
                        placeholder="Nome da Categoria (ex: Barba, Cabelo)"
                        required
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ name: e.target.value })}
                    />
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar Categoria"}
                    </SubmitButton>
                </Form>
            )}

            {abaAtiva === "servico" && (
                <Form onSubmit={handleCreateService}>
                    <Input
                        type="text"
                        placeholder="Nome do Serviço (ex: Corte Degradê)"
                        required
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    />

                    <Input
                        type="number"
                        step="0.01"
                        placeholder="Valor do Serviço R$ (ex: 35,00)"
                        required
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    />

                    <Select
                        required
                        value={serviceForm.category_id}
                        onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                    >
                        <option value="">-- Escolha a Categoria --</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Select>

                    <CheckboxLabel>
                        <input
                            type="checkbox"
                            checked={serviceForm.is_monthly_offer || false}
                            onChange={(e) => setServiceForm({ ...serviceForm, is_monthly_offer: e.target.checked })}
                        />
                        É uma oferta mensal?
                    </CheckboxLabel>

                    {serviceForm.is_monthly_offer && (
                        <Input
                            type="number"
                            placeholder="Porcentagem de desconto (ex: 20 para 20%)"
                            value={serviceForm.discount_percentage || ""}
                            onChange={(e) => setServiceForm({ ...serviceForm, discount_percentage: e.target.value })}
                        />
                    )}

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Processando..." : "Salvar Novo Serviço"}
                    </SubmitButton>
                </Form>
            )}
        </Container>
    );
}

export default AdminGerenciamento;