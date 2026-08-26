import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api.js";
import { useUser } from "../../hooks/userContext.jsx";

import {
  Container,
  Wrapper,
  Title,
  Subtitle,
  Card,
  CardTitle,
  CardDescription,
  InfoRow,
  InfoLabel,
  InfoValue,
  ActionButton,
  PrivacyLink,
  ConfirmOverlay,
  ConfirmBox,
  ConfirmTitle,
  ConfirmText,
  ConfirmActions,
  Form,
  InputContainer,
  InputError,
  ButtonGroup,
} from "./styles.js";

// 🔴 MOVIDO PARA FORA DO COMPONENTE (evita redefinição em todo render)
const profileSchema = yup
  .object({
    name: yup
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .required("O nome é obrigatório"),
    client_phone: yup
      .string()
      .min(8, "Informe um telefone válido com DDI/DDD")
      .required("O telefone é obrigatório"),
  })
  .required();

const passwordSchema = yup
  .object({
    old_password: yup.string().required("A senha atual é obrigatória"),
    new_password: yup
      .string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres")
      .required("A nova senha é obrigatória"),
    confirm_new_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "As senhas devem ser iguais")
      .required("Confirme a nova senha"),
  })
  .required();

export function MinhaConta() {
  const { userInfo, logout, putUserData } = useUser();
  const navigate = useNavigate();

  // Estados de ações
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Controle de exibição dos formulários
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Loading dos formulários
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Controle de visualização das senhas (olhinho)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data } = await api.get("/me");
        if (data) {
          putUserData({
            ...data,
            client_phone: data.client_phone || data.phone || "",
            phone: data.client_phone || data.phone || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados atualizados do usuário:");
      }
    }

    fetchUserData();
  }, [putUserData]);

  // Configuração React Hook Form - Perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    values: {
      name: userInfo?.name || "",
      client_phone: userInfo?.client_phone || userInfo?.phone || "",
    },
  });

  // Configuração React Hook Form - Senha
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Atualização de Perfil (PUT /me)
  async function handleUpdateProfile(data) {
    try {
      setLoadingProfile(true);
      const response = await api.put("/me", {
        name: data.name,
        client_phone: data.client_phone,
      });

      const updatedUser = response.data;

      if (updatedUser) {
        putUserData({
          ...updatedUser,
          client_phone: updatedUser.client_phone || updatedUser.phone || "",
          phone: updatedUser.client_phone || updatedUser.phone || "",
        });
      }

      toast.success("Perfil atualizado com sucesso! 👤");
      setShowProfileForm(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:");
      const msg =
        error.response?.data?.error || "Não foi possível atualizar seus dados.";
      toast.error(msg);
    } finally {
      setLoadingProfile(false);
    }
  }

  // Troca de Senha (PUT /me/password)
  async function handleUpdatePassword(data) {
    try {
      setLoadingPassword(true);
      await api.put("/me/password", {
        old_password: data.old_password,
        new_password: data.new_password,
      });

      toast.success("Senha alterada com sucesso! 🔒");
      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Erro ao alterar senha:");
      const msg =
        error.response?.data?.error || "Não foi possível alterar a senha.";
      toast.error(msg);
    } finally {
      setLoadingPassword(false);
    }
  }

  // Exportação de Dados (GET /me/export-data)
  async function handleExportarDados() {
    try {
      setDownloading(true);
      const response = await api.get("/me/export-data", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `meus-dados_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success("Seus dados foram baixados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar dados:");
      toast.error("Não foi possível baixar seus dados agora.");
    } finally {
      setDownloading(false);
    }
  }

  // Exclusão de Conta (DELETE /me/delete-account)
  async function handleExcluirConta() {
    try {
      setDeleting(true);
      await api.delete("/me/delete-account");
      toast.success("Sua conta foi removida com sucesso.");
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao excluir conta:");
      toast.error("Não foi possível excluir sua conta agora.");
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (!userInfo || Object.keys(userInfo).length === 0) {
    return (
      <Container>
        <Wrapper>
          <Title>Minha Conta e Privacidade</Title>
          <Subtitle>Carregando informações da sua conta...</Subtitle>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>Minha Conta e Privacidade</Title>
        <Subtitle>
          Veja seus dados cadastrados e controle o que fazemos com eles.
        </Subtitle>

        {/* Card de Dados Pessoais */}
        <Card>
          <CardTitle>Seus dados</CardTitle>
          <CardDescription>
            Mantenha seu nome e telefone atualizados para facilitações no
            agendamento.
          </CardDescription>

          {!showProfileForm ? (
            <>
              <InfoRow>
                <InfoLabel>Nome</InfoLabel>
                <InfoValue>{userInfo?.name || "Não informado"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>E-mail</InfoLabel>
                <InfoValue>{userInfo?.email || "Não informado"}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Telefone / WhatsApp</InfoLabel>
                <InfoValue>
                  {userInfo?.client_phone || userInfo?.phone || "Não informado"}
                </InfoValue>
              </InfoRow>

              <div style={{ marginTop: "16px" }}>
                <ActionButton onClick={() => setShowProfileForm(true)}>
                  Editar Dados
                </ActionButton>
              </div>
            </>
          ) : (
            <Form
              onSubmit={handleSubmitProfile(handleUpdateProfile)}
              noValidate
            >
              <InputContainer>
                <label>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  {...registerProfile("name")}
                />
                <InputError>{profileErrors?.name?.message}</InputError>
              </InputContainer>

              <InputContainer>
                <label>E-mail (Não editável)</label>
                <input
                  type="email"
                  value={userInfo?.email || ""}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </InputContainer>

              <InputContainer>
                <label>Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  {...registerProfile("client_phone")}
                />
                <InputError>{profileErrors?.client_phone?.message}</InputError>
              </InputContainer>

              <ButtonGroup>
                <ActionButton
                  type="button"
                  $secondary
                  onClick={() => {
                    setShowProfileForm(false);
                    resetProfileForm();
                  }}
                >
                  Cancelar
                </ActionButton>
                <ActionButton type="submit" disabled={loadingProfile}>
                  {loadingProfile ? "Salvando..." : "Salvar Dados"}
                </ActionButton>
              </ButtonGroup>
            </Form>
          )}
        </Card>

        {/* Card de Alteração de Senha */}
        <Card>
          <CardTitle>Segurança da Conta</CardTitle>
          <CardDescription>
            Gerencie sua senha de acesso ao sistema de forma segura.
          </CardDescription>

          {!showPasswordForm ? (
            <ActionButton onClick={() => setShowPasswordForm(true)}>
              Alterar Senha
            </ActionButton>
          ) : (
            <Form
              onSubmit={handleSubmitPassword(handleUpdatePassword)}
              noValidate
            >
              <InputContainer>
                <label>Senha Atual</label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerPassword("old_password")}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    aria-label={
                      showOldPassword ? "Ocultar senha" : "Exibir senha"
                    }
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#888",
                    }}
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <InputError>{passwordErrors?.old_password?.message}</InputError>
              </InputContainer>

              <InputContainer>
                <label>Nova Senha</label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerPassword("new_password")}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    aria-label={
                      showNewPassword ? "Ocultar senha" : "Exibir senha"
                    }
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#888",
                    }}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <InputError>{passwordErrors?.new_password?.message}</InputError>
              </InputContainer>

              <InputContainer>
                <label>Confirmar Nova Senha</label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerPassword("confirm_new_password")}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Exibir senha"
                    }
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#888",
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <InputError>
                  {passwordErrors?.confirm_new_password?.message}
                </InputError>
              </InputContainer>

              <ButtonGroup>
                <ActionButton
                  type="button"
                  $secondary
                  onClick={() => {
                    setShowPasswordForm(false);
                    resetPasswordForm();
                  }}
                >
                  Cancelar
                </ActionButton>
                <ActionButton type="submit" disabled={loadingPassword}>
                  {loadingPassword ? "Salvando..." : "Salvar Senha"}
                </ActionButton>
              </ButtonGroup>
            </Form>
          )}
        </Card>

        {/* Card de Exportação de Dados */}
        <Card>
          <CardTitle>Baixar meus dados</CardTitle>
          <CardDescription>
            Faça o download de uma cópia de tudo que guardamos sobre você,
            incluindo seu histórico de agendamentos.
          </CardDescription>
          <ActionButton onClick={handleExportarDados} disabled={downloading}>
            {downloading ? "Preparando arquivo..." : "Baixar meus dados"}
          </ActionButton>
        </Card>

        {/* Card de Exclusão de Conta */}
        <Card>
          <CardTitle>Excluir minha conta</CardTitle>
          <CardDescription>
            Isso remove permanentemente seus dados pessoais (nome, e-mail,
            telefone) do sistema. Registros financeiros de atendimentos já
            concluídos podem ser mantidos de forma anônima, sem te identificar,
            conforme exigido pela legislação fiscal.
          </CardDescription>
          <ActionButton $danger onClick={() => setConfirmOpen(true)}>
            Excluir minha conta
          </ActionButton>
        </Card>

        <PrivacyLink href="/politica-de-privacidade" target="_blank">
          Ler Política de Privacidade completa
        </PrivacyLink>
      </Wrapper>

      {/* Modal de Confirmação para Exclusão */}
      {confirmOpen && (
        <ConfirmOverlay>
          <ConfirmBox>
            <ConfirmTitle>Tem certeza?</ConfirmTitle>
            <ConfirmText>
              Esta ação não pode ser desfeita. Seus dados pessoais serão
              removidos e você será desconectado imediatamente.
            </ConfirmText>
            <ConfirmActions>
              <ActionButton
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                Cancelar
              </ActionButton>
              <ActionButton
                $danger
                onClick={handleExcluirConta}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Sim, excluir"}
              </ActionButton>
            </ConfirmActions>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Container>
  );
}
