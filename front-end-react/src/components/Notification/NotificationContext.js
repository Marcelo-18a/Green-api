import { createContext, useContext, useState } from "react";
import Notification from "../Notification";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type, duration };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Funções de conveniência
  const showSuccess = (message, duration) =>
    addNotification(message, "success", duration);
  const showError = (message, duration) =>
    addNotification(message, "error", duration);
  const showWarning = (message, duration) =>
    addNotification(message, "warning", duration);
  const showInfo = (message, duration) =>
    addNotification(message, "info", duration);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}

      {/* Container das notificações */}
      <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{
              marginTop: index * 10,
              transform: `translateY(${index * 80}px)`,
            }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
