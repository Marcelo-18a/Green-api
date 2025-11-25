import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import styles from "@/components/Menu/Menu.module.css";
import Link from "next/link";
import { logout } from "@/utils/auth";
import { useRouter } from "next/router";
import { useNotification } from "@/components/Notification/NotificationContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggleMini from "@/components/ThemeToggleMini";

const Menu = () => {
  const [menuIcon, setMenuIcon] = useState(<FaBars />);
  const [isActive, setIsActive] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { showSuccess } = useNotification();

  const activeMenu = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setMenuIcon(<IoClose />);
    } else {
      setMenuIcon(<FaBars />);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    showSuccess("Logout realizado com sucesso!");
    logout(router);
    setShowLogoutConfirm(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/home">
          <img src="/images/logo-greenleaf2.png" alt="GreenLeaf Logo" />
        </Link>
      </div>
      <div className={styles.menu}>
        {/* Theme Toggle - Desktop */}
        <div className={styles.themeToggleDesktop}>
          <ThemeToggleMini position="relative" />
        </div>

        {/* isActive && styles.active */}
        <ul
          className={`${styles.menuItems} ${isActive ? styles.active : ""}`}
          id={styles.menuItems}
        >
          <li className={styles.dashboardItem}>
            <Link href="/dashboard">
              <span className={styles.dashboardIcon}>📊</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <Link href="/map">Mapa</Link>
          </li>
          <li>
            <Link href="/create">Cadastrar folhas</Link>
          </li>
          <li className={styles.themeToggleItem}>
            <ThemeToggleMini position="relative" />
          </li>
          <li>
            <a onClick={handleLogout} href="#">
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.menuBtn} id="menuBtn">
        {/* Ícone do React Icons */}
        <i id={styles.menuIcon} onClick={activeMenu}>
          {menuIcon}
        </i>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair da aplicação?"
        confirmText="Sair"
        cancelText="Cancelar"
      />
    </nav>
  );
};

export default Menu;
