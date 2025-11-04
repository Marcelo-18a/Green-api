import { useState } from "react";
import { login } from "@/utils/auth";
import { useRouter } from "next/router";
import styles from "@/components/LoginContent/LoginContent.module.css";

const LoginContent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      router.push("/home");
    } else {
      alert("Falha ao fazer o login. Tente novamente")
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
