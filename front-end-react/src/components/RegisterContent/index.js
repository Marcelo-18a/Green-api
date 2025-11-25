import { useState } from "react";
import { useRouter } from "next/router";
import { useNotification } from "@/components/Notification/NotificationContext";
import ThemeToggleCompact from "@/components/ThemeToggleCompact";
import styles from "@/components/RegisterContent/RegisterContent.module.css";

const RegisterContent = () => {
  const router = useRouter();
  const { showError, showSuccess } = useNotification();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      showError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        showSuccess(
          "Cadastro realizado com sucesso! Faça seu login para continuar."
        );
        router.push("/");
      } else {
        const error = await response.text();
        showError("Erro ao criar conta. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      showError("Erro de conexão. Tente novamente em alguns instantes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContent}>
      {/* THEME TOGGLE */}
      <div className={styles.themeToggleContainer}>
        <ThemeToggleCompact className={styles.fixedToggle} />
      </div>

      {/* REGISTER CARD */}
      <div className={styles.registerCard}>
        {/* REGISTER CARD HEADER */}
        <div className={styles.registerCardHeader}>
          <h3>Criar sua conta:</h3>
        </div>
        {/* REGISTER CARD BODY */}
        <div className={styles.registerCardBody}>
          <form className="formPrimary" onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              className={`${styles.input} ${"inputPrimary"}`}
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={`${styles.input} ${"inputPrimary"}`}
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={`${styles.input} ${"inputPrimary"}`}
              disabled={loading}
            />
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className={`${styles.input} ${"inputPrimary"}`}
              disabled={loading}
            />
            <input
              type="submit"
              value={loading ? "Criando..." : "Criar Conta"}
              className={`${styles.input} ${"btnPrimary"}`}
              disabled={loading}
            />
          </form>
        </div>
        {/* LINK PARA LOGIN */}
        <div className={styles.loginLink}>
          <p>
            Já tem uma conta?{" "}
            <span className={styles.loginText} onClick={() => router.push("/")}>
              Faça seu login aqui
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterContent;
