import PropTypes from "prop-types";
import { ContainerButton } from "./styles.js";

export function Button({ children, ...props }) {
    return (
        <ContainerButton {...props}>
            {children}
        </ContainerButton>
    );
}

Button.propTypes = {
    // Mudar de string para node permite que o botão receba textos, ícones ou spans dentro dele sem quebrar
    children: PropTypes.node.isRequired, 
};