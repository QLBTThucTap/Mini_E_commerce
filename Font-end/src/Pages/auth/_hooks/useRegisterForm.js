import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import Instance from "../../../Services/http";
import { registerSchema } from "../_schema/registerSchema";
export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      await Instance.post("users", {
        email: data.email,
        username: data.email.split("@")[0] || data.email,
        password: data.password,
        name: data.name,
        fullName: data.name,
      });

      navigate("/login", {
        state: { registeredEmail: data.email, registeredName: data.name },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
      setServerError(message);
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    serverError,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
  };
};
