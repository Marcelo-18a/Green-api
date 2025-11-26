import { useRouter } from "next/router";
import Link from "next/link";
import { logout } from "@/utils/auth";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen = false, onClose }) => {
  const router = useRouter();

  const menuItems = [
    {
      href: "/home",
      icon: "🏠",
      label: "Home",
      description: "Página inicial",
    },
    {
      href: "/create",
      icon: "🌿",
      label: "Cadastrar Folha",
      description: "Adicionar nova amostra",
    },
    {
      href: "/map",
      icon: "🗺️",
      label: "Mapa",
      description: "Visualização geográfica",
    },
    {
      href: "/dashboard",
      icon: "📊",
      label: "Dashboard",
      description: "Visão geral dos dados",
    },
  ];

  const handleLogout = () => {
    logout(router);
  };

  const handleMenuClick = () => {
    // Fechar sidebar em mobile ao clicar em um menu
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/home" onClick={handleMenuClick}>
          <img src="/images/logo-greenleaf2.png" alt="GreenLeaf Logo" />
        </Link>
        <h3>Green Leaf</h3>
      </div>

      {/* Menu Items */}
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.href} className={styles.menuItem}>
              <Link
                href={item.href}
                className={`${styles.menuLink} ${
                  router.pathname === item.href ? styles.active : ""
                }`}
                onClick={handleMenuClick}
              >
                <span className={styles.icon}>{item.icon}</span>
                <div className={styles.textContent}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.description}>{item.description}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.icon}>🚪</span>
            <div className={styles.textContent}>
              <span className={styles.label}>Sair</span>
              <span className={styles.description}>Fazer logout</span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
