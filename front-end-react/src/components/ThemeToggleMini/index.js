import { useTheme } from "@/contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./ThemeToggleMini.module.css";

const ThemeToggleMini = ({ position = "fixed" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggleMini} ${styles[position]}`}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={
        isDark
          ? "Tema: Escuro (clique para claro)"
          : "Tema: Claro (clique para escuro)"
      }
    >
      {isDark ? (
        <FiSun className={styles.icon} aria-hidden="true" />
      ) : (
        <FiMoon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggleMini;
