import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Fechar sidebar quando clicar fora dela em mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        const sidebar = document.querySelector(`.${styles.sidebar}`);
        const mobileBtn = document.querySelector(`.${styles.mobileMenuBtn}`);

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          !mobileBtn.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
