import { useEffect } from "react";
import AppRouter from "./Routes/AppRouter";
import useAuthStore from "./Stores/authStore";
import ScrollToTop from "./Components/common/ScrollToTop";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div>
      <ScrollToTop />
      <AppRouter />
    </div>
  );
}

export default App;
