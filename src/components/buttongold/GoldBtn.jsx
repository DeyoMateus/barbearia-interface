// Um componente de botão genérico. Ele aceita propriedades (props) dinâmicas para se adaptar (pode ser transparente ou desativado).
import React from "react";
import { StyledGoldBtn } from "./styles.js";

export function GoldBtn({ children, onClick, disabled, style = {}, outline = false }) {
    return (
        <StyledGoldBtn onClick={onClick} disabled={disabled} $outline={outline} style={style}>
            {children}
        </StyledGoldBtn>
    );
}