import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Đặt 60s: trong 60s kể từ lần fetch gần nhất, coi data còn "fresh",
      // không tự động fetch lại khi remount/focus lại tab.
      staleTime: 60 * 1000,

      // Thời gian cache được giữ lại trong bộ nhớ sau khi không còn component nào dùng
      gcTime: 5 * 60 * 1000, // 5 phút

      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
