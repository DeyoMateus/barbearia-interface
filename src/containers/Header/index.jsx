import { useNavigate, useResolvedPath } from "react-router-dom";
import { useUser } from '../../hooks/userContext';

import {
    Container,
    HeaderLink,
    LinkContainer,
    Logout,
    Navigation,
    Options,
    Profile,
    Content,
} from "./styles";

import { UserCircleIcon } from "@phosphor-icons/react";

export function Header() {
    const navigate = useNavigate();
    const { logout, userInfo } = useUser();
    const { pathname } = useResolvedPath();

    function logoutUser() {
        logout();
        navigate('/login', { replace: true });
    }

    const isEmployee =
        userInfo?.admin === true ||
        userInfo?.role === "barber";

    const isEmployee2 =
        userInfo?.admin === true;

    return (
        <Container>
            <Content>
                <Navigation>
                    <div>
                        <HeaderLink to='/app' $isActive={pathname === '/app'}>Home</HeaderLink>

                        <hr />
                        <HeaderLink to='/app/Servico' $isActive={pathname === '/app/Servico'}>Meus Agendamentos</HeaderLink>

                        {isEmployee && (
                            <>
                                <hr />
                                <HeaderLink to='/app/agenda' $isActive={pathname === '/app/agenda'}>Agenda</HeaderLink>
                                <hr />
                                <HeaderLink to='/app/painel' $isActive={pathname === '/app/painel'}>Painel</HeaderLink>
                            </>
                        )}

                        {isEmployee2 && (
                            <>
                                <hr />
                                <HeaderLink to='/app/menu' $isActive={pathname === '/app/menu'}>Menu Admin</HeaderLink>
                            </>
                        )}



                    </div>
                </Navigation>

                <Options>
                    <LinkContainer>
                        <HeaderLink to='/app/agendamento' $isActive={pathname === '/app/agendamento'}>Agendamento</HeaderLink>
                    </LinkContainer>
                    <Profile>
                        <HeaderLink to='/app/minha-conta' $isActive={pathname === '/app/minha-conta'}>Minha Conta</HeaderLink>
                        <UserCircleIcon color="#c9a84c" size={24} />
                        <div>
                            <p>Olá, <span>{userInfo?.name || "Usuário"}</span></p>
                            <Logout onClick={logoutUser}>Sair</Logout>
                        </div>

                    </Profile>

                </Options>
            </Content>
        </Container>
    );
}