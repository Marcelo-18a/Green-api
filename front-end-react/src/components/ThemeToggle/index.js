import { useTheme } from "@/contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <FiSun className={styles.icon} aria-hidden="true" />
      ) : (
        <FiMoon className={styles.icon} aria-hidden="true" />
      )}
      <span className={styles.text}>{isDark ? "Claro" : "Escuro"}</span>
    </button>
  );
};

export default ThemeToggle;
