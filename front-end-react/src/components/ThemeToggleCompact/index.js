import { useTheme } from "@/contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./ThemeToggleCompact.module.css";

const ThemeToggleCompact = ({ className = "" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggleCompact} ${className}`}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <FiSun className={styles.icon} aria-hidden="true" />
      ) : (
        <FiMoon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggleCompact;
