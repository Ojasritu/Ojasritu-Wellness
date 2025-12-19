import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./styles/main.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { getGoogleClientId } from './config';

const clientId = getGoogleClientId();

if (!clientId) console.info('Google OAuth not initialized: VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will be unavailable.');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Only initialize Google OAuth when a valid client id is present */}
    {clientId ? (
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    )}
  </React.StrictMode>
);
