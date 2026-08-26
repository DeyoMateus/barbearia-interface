import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

import {
  Container,
  Header,
  LogoutButton,
  GridSection,
  Card,
  CardHeader,
  Form,
  Input,
  Select,
  SubmitButton,
  TableWrapper,
  Table,
  LogoImage,
  LogoPlaceholder,
  ShopName,
  ShopSlug,
  StatusBadge,
  ActionButton,
} from "./styles";

export function SuperAdminDashboard() {
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [domain, setDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [homeBannerUrl, setHomeBannerUrl] = useState("");

  const [selectedShopId, setSelectedShopId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);

  useEffect(() => {
    loadBarbershops();
  }, []);

  async function loadBarbershops() {
    try {
      const response = await api.get("/super/barbershops");
      setBarbershops(response.data);
    } catch (err) {
      console.error("Erro ao carregar barbearias:");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBarbershop(e) {
    e.preventDefault();
    try {
      await api.post("/super/barbershops", {
        name,
        slug,
        cnpj,
        domain: domain || null,
        logo_url: logoUrl || null,
        home_banner_url: homeBannerUrl || null,
      });
      alert("Barbearia criada com sucesso!");
      setName("");
      setSlug("");
      setCnpj("");
      setDomain("");
      setLogoUrl("");
      setHomeBannerUrl("");
      loadBarbershops();
    } catch (err) {
      alert(
        "Erro ao criar barbearia: " +
          (err.response?.data?.message ||
            err.response?.data?.error ||
            err.message),
      );
    }
  }

  async function handleSaveAdmin(e) {
    e.preventDefault();
    if (!selectedShopId) {
      alert("Por favor, selecione uma barbearia.");
      return;
    }

    try {
      const payload = {
        name: adminName,
        email: adminEmail,
        password: adminPassword || undefined,
        client_phone: adminPhone,
      };

      if (isEditingAdmin) {
        await api.put(`/super/barbershops/${selectedShopId}/admin`, payload);
        alert("Administrador atualizado com sucesso!");
      } else {
        await api.post(`/super/barbershops/${selectedShopId}/admin`, payload);
        alert("Administrador criado com sucesso!");
      }

      resetAdminForm();
      loadBarbershops();
    } catch (err) {
      alert(
        "Erro ao salvar admin: " + (err.response?.data?.error || err.message),
      );
    }
  }

  async function handleEditAdminClick(shop) {
    setSelectedShopId(shop.id);

    const admin = shop.users && shop.users.length > 0 ? shop.users[0] : null;

    if (admin) {
      setIsEditingAdmin(true); // Se existir admin, entra no modo Edição (PUT)
      setAdminName(admin.name || "");
      setAdminEmail(admin.email || "");
      setAdminPhone(admin.client_phone || "");
      setAdminPassword("");
    } else {
      setIsEditingAdmin(false); // Se NÃO existir admin, entra no modo Cadastro (POST)
      setAdminName("");
      setAdminEmail("");
      setAdminPhone("");
      setAdminPassword("");
    }
  }

  function handleShopSelectChange(shopId) {
    setSelectedShopId(shopId);

    const shop = barbershops.find((s) => s.id === shopId);
    const admin = shop?.users && shop.users.length > 0 ? shop.users[0] : null;

    if (admin) {
      setIsEditingAdmin(true);
      setAdminName(admin.name || "");
      setAdminEmail(admin.email || "");
      setAdminPhone(admin.client_phone || "");
      setAdminPassword("");
    } else {
      setIsEditingAdmin(false);
      setAdminName("");
      setAdminEmail("");
      setAdminPhone("");
      setAdminPassword("");
    }
  }

  async function handleDeleteAdmin(shopId) {
    if (
      !confirm(
        "Tem certeza que deseja remover o administrador desta barbearia?",
      )
    )
      return;

    try {
      await api.delete(`/super/barbershops/${shopId}/admin`);
      alert("Administrador removido com sucesso!");
      resetAdminForm();
      loadBarbershops();
    } catch (err) {
      alert(
        "Erro ao excluir admin: " + (err.response?.data?.error || err.message),
      );
    }
  }

  function resetAdminForm() {
    setSelectedShopId("");
    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminPhone("");
    setIsEditingAdmin(false);
  }

  async function handleToggleStatus(shopId, currentStatus) {
    const actionName = currentStatus ? "suspender" : "ativar";
    if (!confirm(`Tem certeza que deseja ${actionName} esta barbearia?`))
      return;

    try {
      await api.patch(`/super/barbershops/${shopId}/status`, {
        active: !currentStatus,
      });
      alert(`Barbearia ${currentStatus ? "suspensa" : "ativada"} com sucesso!`);
      loadBarbershops();
    } catch (err) {
      alert(
        "Erro ao alterar status: " +
          (err.response?.data?.message || err.message),
      );
    }
  }

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Erro ao fazer logout:");
    } finally {
      navigate("/super/sessions");
    }
  }

  if (loading)
    return (
      <Container>
        <p>Carregando painel do SuperAdmin...</p>
      </Container>
    );

  return (
    <Container>
      <Header>
        <h1>Painel do SuperAdmin</h1>
        <LogoutButton onClick={handleLogout}>Sair da Conta</LogoutButton>
      </Header>

      <GridSection>
        {/* Cadastro de Barbearia */}
        <Card>
          <h2>Cadastrar Nova Barbearia</h2>
          <Form onSubmit={handleCreateBarbershop}>
            <Input
              type="text"
              placeholder="Nome da Barbearia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Slug (ex: barbearia-central)"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9-]/g, ""),
                )
              }
              required
            />
            <Input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Domínio Personalizado (opcional, ex: app.suabarbearia.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Input
              type="text"
              placeholder="URL da Logo (opcional)"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <Input
              type="text"
              placeholder="URL do Banner/Foto da Home (opcional)"
              value={homeBannerUrl}
              onChange={(e) => setHomeBannerUrl(e.target.value)}
            />
            <SubmitButton type="submit">Criar Barbearia</SubmitButton>
          </Form>
        </Card>

        {/* Cadastro / Edição de Admin da Barbearia */}
        <Card>
          <CardHeader>
            <h2>
              {isEditingAdmin
                ? "Editar Admin da Barbearia"
                : "Cadastrar Admin da Barbearia"}
            </h2>
            {isEditingAdmin && (
              <button type="button" onClick={resetAdminForm}>
                Cancelar Edição
              </button>
            )}
          </CardHeader>
          <Form onSubmit={handleSaveAdmin}>
            <Select
              value={selectedShopId}
              onChange={(e) => handleShopSelectChange(e.target.value)}
              required
            >
              <option value="">Selecione a Barbearia...</option>
              {barbershops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} ({shop.slug})
                </option>
              ))}
            </Select>
            <Input
              type="text"
              placeholder="Nome do Administrador"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-mail do Administrador"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder={
                isEditingAdmin
                  ? "Nova Senha (deixe em branco para manter)"
                  : "Senha de Acesso"
              }
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required={!isEditingAdmin}
            />
            <Input
              type="text"
              placeholder="Telefone / WhatsApp"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
            />
            <SubmitButton type="submit" $isEditing={isEditingAdmin}>
              {isEditingAdmin
                ? "Salvar Alterações do Admin"
                : "Criar Administrador"}
            </SubmitButton>
          </Form>
        </Card>
      </GridSection>

      {/* Listagem de Barbearias e seus Admins */}
      <Card>
        <h2>Barbearias e Administradores Cadastrados</h2>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Barbearia</th>
                <th>Domínio</th>
                <th>Admin Vinculado</th>
                <th>E-mail do Admin</th>
                <th>Status</th>
                <th>Ações da Barbearia</th>
                <th>Ações do Admin</th>
              </tr>
            </thead>
            <tbody>
              {barbershops.map((shop) => {
                const admin =
                  shop.users && shop.users.length > 0 ? shop.users[0] : null;
                return (
                  <tr key={shop.id}>
                    <td>
                      {shop.logo_url ? (
                        <LogoImage src={shop.logo_url} alt={shop.name} />
                      ) : (
                        <LogoPlaceholder>s/ foto</LogoPlaceholder>
                      )}
                    </td>
                    <td>
                      <ShopName>{shop.name}</ShopName>
                      <ShopSlug>{shop.slug}</ShopSlug>
                    </td>
                    <td>{shop.domain || "-"}</td>
                    <td>{admin ? admin.name : <i>Sem admin</i>}</td>
                    <td>{admin ? admin.email : "-"}</td>
                    <td>
                      <StatusBadge $active={shop.active}>
                        {shop.active ? "Ativa" : "Suspensa"}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionButton
                        $variant={shop.active ? "danger" : "success"}
                        onClick={() => handleToggleStatus(shop.id, shop.active)}
                      >
                        {shop.active ? "Suspender" : "Ativar"}
                      </ActionButton>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <ActionButton
                          $variant="amber"
                          onClick={() => handleEditAdminClick(shop)}
                        >
                          {admin ? "Editar Admin" : "Criar Admin"}
                        </ActionButton>
                        {admin && (
                          <ActionButton
                            $variant="danger"
                            onClick={() => handleDeleteAdmin(shop.id)}
                          >
                            Excluir Admin
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
    </Container>
  );
}
