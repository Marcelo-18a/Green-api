import { useState } from "react";
import styles from "./ConfirmDialog.module.css";

const ConfirmDialog = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return "⚠️";
      case "warning":
        return "❓";
      case "info":
        return "ℹ️";
      default:
        return "❓";
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <span className={styles.icon}>{getIcon()}</span>
          <h3 className={styles.title}>Confirmação</h3>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.confirmButton} ${styles[type]}`}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
