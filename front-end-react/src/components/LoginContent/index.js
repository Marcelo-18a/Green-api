import { useState } from "react";
import { login } from "@/utils/auth";
import { useRouter } from "next/router";
import { useNotification } from "@/components/Notification/NotificationContext";
import styles from "@/components/LoginContent/LoginContent.module.css";

const LoginContent = () => {
  const router = useRouter();
  const { showError, showSuccess } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!email || !password) {
      showError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        showSuccess("Login realizado com sucesso!");
        router.push("/home");
      } else {
        showError(
          "Falha ao fazer o login. Verifique suas credenciais e tente novamente"
        );
      }
    } catch (error) {
      showError("Erro de conexão. Tente novamente em alguns instantes");
    }
  };

  return (
    <div className={styles.loginContent}>
      {/* LOGO */}
      {/* <div className={styles.logo}>
        <img
          src="/images/thegames_logo.png"
          className={styles.logoImg}
          alt="The Games"
        />
      </div> */}
      {/* LOGIN CARD */}
      <div className={styles.loginCard}>
        {/* LOGIN CARD HEADER */}
        <div className={styles.loginCardHeader}>
          <h3>Faça seu login:</h3>
        </div>
        {/* LOGIN CARD BODY */}
        <div className={styles.loginCardBody}>
          <form className="formPrimary" onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={`${styles.input} ${"inputPrimary"}`}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={`${styles.input} ${"inputPrimary"}`}
            />
            <input
              type="submit"
              value="Entrar"
              className={`${styles.input} ${"btnPrimary"}`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
