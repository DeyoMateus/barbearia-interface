// src/containers/AceitarPolitica/index.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/userContext.jsx";
import { Overlay, Box, Title, Text, PolicyLink, Actions, AcceptButton, LogoutButton } from "./styles.js";

export function AceitarPolitica() {
    const { acceptPrivacyPolicy, logout } = useUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleAceitar() {
        try {
            setLoading(true);

            // Chama a função centralizada do Contexto (já faz o PUT e atualiza o estado/localStorage)
            await acceptPrivacyPolicy();

            toast.success("Termos aceitos com sucesso!");

            // Redireciona o usuário para o app
            navigate("/app");
        } catch (error) {
            console.error("Erro ao aceitar política:", error);
            toast.error("Não foi possível registrar seu aceite. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Overlay>
            <Box>
                <Title>Antes de continuar</Title>
                <Text>
                    Sua conta precisa do aceite dos termos para prosseguir. Para usar o sistema,
                    leia e aceite nossa{" "}
                    <PolicyLink href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
                        Política de Privacidade
                    </PolicyLink>.
                </Text>
                <Actions>
                    <LogoutButton onClick={logout}>Sair</LogoutButton>
                    <AcceptButton onClick={handleAceitar} disabled={loading}>
                        {loading ? "Registrando..." : "Li e aceito"}
                    </AcceptButton>
                </Actions>
            </Box>
        </Overlay>
    );
}