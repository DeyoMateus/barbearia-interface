import { UserProvider } from "./userContext.jsx";



const AppProvider = ({ children }) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    )
};

export default AppProvider;