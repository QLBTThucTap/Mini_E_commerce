// import HomePage from "./Pages/home/HomePage";
// import LoginPage from "./Pages/auth/LoginPage";
// import RegisterPage from "./Pages/auth/RegisterPage";
import { useEffect } from "react";
import AppRouter from "./Routes/AppRouter";
import useAuthStore from "./Stores/authStore";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div>
      <AppRouter></AppRouter>
    </div>
  );
}
export default App;
