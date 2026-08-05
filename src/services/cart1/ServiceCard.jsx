import React from "react";
import {
    CardContainer,
    CardHeader,
    ServiceName,
    ServicePrice,
    ActionButton
} from "./styles";

export function ServiceCard({ service, inCart, onToggle }) {
    return (
        // Passamos o estado "inCart" com um prefixo "$" para o styled-components usar na borda
        <CardContainer $inCart={inCart}>
            <CardHeader>
                <ServiceName>{service.title || service.name}</ServiceName>
                <ServicePrice>
                    {Number(service?.price || 0).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </ServicePrice>
            </CardHeader>


            {/* Botão muda de cor e texto dependendo se o item já está selecionado */}
            <ActionButton $inCart={inCart} onClick={onToggle}>
                {inCart ? "Remover serviço ✕" : "Selecionar serviço ➔"}
            </ActionButton>
        </CardContainer>
    );
}