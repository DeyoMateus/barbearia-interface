import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { router } from './routes';
import GlobalStyles from './styles/globalStyles.js'
import { CartProvider } from './hooks/useCart.jsx';
import AppProvider from './hooks/index.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <GlobalStyles />
        <ToastContainer autoClose={2000} theme='colored' />
      </CartProvider>
    </AppProvider>
  </StrictMode>,
)
