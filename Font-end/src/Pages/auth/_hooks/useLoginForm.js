import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";

import useAuthStore from "../../../Stores/authStore";
import Instance from "../../../Services/http";
import { loginSchema } from "../_schema/loginSchema";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const registeredName = location.state?.registeredName;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: registeredName || "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await Instance.post("auth/login", {
        name: data.name,
        username: data.name,
        password: data.password,
      });
      const result = await response.data;

      login({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      // if (result.accessToken) {
      //   localStorage.setItem("access_token", result.accessToken);
      // }

      navigate(result.user?.role === "admin" ? "/admin/dashboard" : "/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản.";
      setServerError(message);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    serverError,
    showPassword,
    toggleShowPassword,
    rememberDevice,
    setRememberDevice,
    registeredName,
  };
};
