import "@/styles/globals.css";
import { NotificationProvider } from "@/components/Notification/NotificationContext";

export default function App({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}
