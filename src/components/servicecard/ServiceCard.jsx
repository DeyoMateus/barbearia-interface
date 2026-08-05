// Representa o card individual do serviço. Ele avisa o componente pai quando foi clicado através de um callback (onToggle), mantendo o fluxo unidirecional de dados do React.
import React, { useState } from "react";
import {
    CardWrapper,
    CheckBadge,
    ServiceName,
    ServiceDescription,
    FooterRow,
    ServicePrice,
    ServiceDuration,
} from "./styles.js";

export function ServiceCard({ service, inCart, onToggle }) {
    const [hover, setHover] = useState(false);

    return (
        <CardWrapper
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onToggle}
            $inCart={inCart}
            $hover={hover}
        >
            {inCart && <CheckBadge>✓</CheckBadge>}
            <ServiceName>{service.name}</ServiceName>
            <ServiceDescription>{service.desc ?? service.description ?? ""}</ServiceDescription>
            <FooterRow>
                <ServicePrice>R$ {service.price}</ServicePrice>
                <ServiceDuration>{service.duration} min</ServiceDuration>
            </FooterRow>
        </CardWrapper>
    );
}