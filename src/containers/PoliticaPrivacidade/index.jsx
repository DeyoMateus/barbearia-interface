// src/containers/PoliticaPrivacidade/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { C, font } from "../../constants/theme.js";

const sectionTitle = {
  color: C.gold,
  fontSize: "clamp(18px, 4vw, 20px)",
  marginTop: "clamp(24px, 5vw, 32px)",
  marginBottom: 10,
  lineHeight: 1.3,
};

const paragraph = {
  fontFamily: font.body,
  color: C.text,
  fontSize: "clamp(14px, 2.5vw, 15px)",
  lineHeight: 1.7,
  marginBottom: 8,
  wordBreak: "break-word",
};

const listItem = {
  ...paragraph,
  marginLeft: "clamp(10px, 3vw, 20px)",
};

export function PoliticaPrivacidade() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        width: "100%",
        padding: "clamp(30px, 6vw, 60px) clamp(16px, 4vw, 20px)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontFamily: font.display,
            color: C.gold,
            fontSize: "clamp(22px, 5vw, 30px)",
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          Política de Privacidade
        </h1>
        <p
          style={{
            ...paragraph,
            color: C.muted,
            fontSize: "clamp(12px, 2vw, 13px)",
          }}
        >
          Última atualização: 13 de julho de 2026
        </p>

        <p style={paragraph}>
          Esta política explica, de forma clara, quais dados pessoais coletamos
          de você ao usar nosso sistema de agendamento, para que servem, com
          quem são compartilhados e quais direitos você tem sobre eles —
          conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <h2 style={sectionTitle}>1. Quais dados coletamos</h2>
        <p style={listItem}>• Nome completo</p>
        <p style={listItem}>• E-mail</p>
        <p style={listItem}>• Telefone</p>
        <p style={listItem}>
          • Senha (armazenada apenas como um código criptografado — nunca em
          texto legível, nem por nós)
        </p>
        <p style={listItem}>
          • Histórico de agendamentos: datas, horários, serviços escolhidos e
          barbeiro atendente
        </p>
        <p style={listItem}>
          • Para administradores e barbeiros: dados adicionais de faturamento
          vinculados aos atendimentos que realizam
        </p>

        <h2 style={sectionTitle}>2. Por que coletamos esses dados</h2>
        <p style={paragraph}>Usamos seus dados apenas para:</p>
        <p style={listItem}>• Criar e gerenciar sua conta e permitir o login</p>
        <p style={listItem}>
          • Registrar, exibir e permitir o cancelamento dos seus agendamentos
        </p>
        <p style={listItem}>
          • Entrar em contato sobre seu agendamento (ex: confirmação, lembrete)
        </p>
        <p style={listItem}>
          • Gerar relatórios financeiros e fiscais da barbearia (apenas para
          administradores)
        </p>
        <p style={listItem}>
          • Cumprir obrigações legais e fiscais quando exigido por lei
        </p>

        <h2 style={sectionTitle}>3. Base legal para o tratamento dos dados</h2>
        <p style={paragraph}>
          Tratamos seus dados com base em três fundamentos previstos na LGPD:
        </p>
        <p style={listItem}>
          • <strong>Execução de contrato:</strong> precisamos do seu nome,
          telefone e e-mail para que o agendamento realmente funcione.
        </p>
        <p style={listItem}>
          • <strong>Consentimento:</strong> ao marcar a caixa de aceite no
          cadastro, você concorda com esta política.
        </p>
        <p style={listItem}>
          • <strong>Cumprimento de obrigação legal:</strong> dados financeiros
          de atendimentos concluídos podem precisar ser mantidos por exigência
          fiscal, mesmo que você solicite a exclusão da sua conta.
        </p>

        <h2 style={sectionTitle}>4. Com quem compartilhamos seus dados</h2>
        <p style={paragraph}>
          Não vendemos nem alugamos seus dados pessoais para ninguém. Seus dados
          só são visíveis para:
        </p>
        <p style={listItem}>• Você mesmo, através da sua conta</p>
        <p style={listItem}>
          • Os administradores e barbeiros da barbearia específica onde você tem
          cadastro (nunca de outra barbearia)
        </p>
        <p style={listItem}>
          • Autoridades públicas, apenas se formalmente exigido por lei
        </p>

        <h2 style={sectionTitle}>5. Por quanto tempo guardamos seus dados</h2>
        <p style={paragraph}>
          Guardamos seus dados enquanto sua conta estiver ativa. Se você
          solicitar a exclusão da conta, seus dados pessoais (nome, e-mail,
          telefone) são anonimizados imediatamente. Registros financeiros de
          atendimentos já concluídos podem ser mantidos, sem nenhum dado que te
          identifique, pelo prazo exigido pela legislação fiscal brasileira.
        </p>

        <h2 style={sectionTitle}>6. Seus direitos como titular dos dados</h2>
        <p style={paragraph}>
          Você pode, a qualquer momento, direto na sua conta:
        </p>
        <p style={listItem}>
          • <strong>Acessar</strong> uma cópia de todos os seus dados
        </p>
        <p style={listItem}>
          • <strong>Corrigir</strong> dados incompletos ou desatualizados
        </p>
        <p style={listItem}>
          • <strong>Excluir</strong> sua conta e anonimizar seus dados pessoais
        </p>
        <p style={listItem}>
          • <strong>Revogar seu consentimento</strong> a qualquer momento
        </p>
        <p style={listItem}>
          • Solicitar informações sobre com quem seus dados foram compartilhados
        </p>

        <h2 style={sectionTitle}>7. Como exercer seus direitos</h2>
        <p style={paragraph}>
          Dentro do sistema, acesse <strong>"Meus Dados"</strong> no seu perfil
          para baixar uma cópia de tudo que temos sobre você, ou{" "}
          <strong>"Excluir minha conta"</strong> para solicitar a remoção.
          Dúvidas adicionais podem ser enviadas para o e-mail de contato
          informado pela barbearia.
        </p>

        <h2 style={sectionTitle}>8. Segurança dos dados</h2>
        <p style={paragraph}>
          Sua senha nunca é armazenada em texto legível — usamos criptografia
          (bcrypt). O acesso ao sistema é protegido por sessão segura (cookie
          HttpOnly), e cada barbearia só enxerga os dados dos seus próprios
          clientes.
        </p>

        <h2 style={sectionTitle}>9. Alterações nesta política</h2>
        <p style={paragraph}>
          Podemos atualizar esta política periodicamente. Caso alterações
          relevantes sejam feitas, avisaremos você por e-mail ou por aviso
          dentro do sistema.
        </p>
      </div>
    </div>
  );
}
