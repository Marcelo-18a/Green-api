import "@/styles/globals.css";
import { NotificationProvider } from "@/components/Notification/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GlobalThemeToggle from "@/components/GlobalThemeToggle";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Component {...pageProps} />
        <GlobalThemeToggle />
      </NotificationProvider>
    </ThemeProvider>
  );
}
