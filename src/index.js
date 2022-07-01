import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import UserProvider from "./components/providers/AuthProvider";
import CartProvider from "./components/providers/CartProvider";
// import ScreenLoader from "./components/common/ScreenLoader";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.render(
  <Suspense fallback={null}>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <Router>
            <App />
          </Router>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  </Suspense>,
  document.getElementById("root")
);
