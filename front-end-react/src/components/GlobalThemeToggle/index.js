import { useRouter } from "next/router";
import ThemeToggleMini from "@/components/ThemeToggleMini";

const GlobalThemeToggle = () => {
  const router = useRouter();

  // Páginas onde não queremos mostrar o toggle global (já tem próprio)
  const excludePages = ["/", "/register"];

  // Não mostrar se estiver numa página que já tem toggle próprio
  if (excludePages.includes(router.pathname)) {
    return null;
  }

  return <ThemeToggleMini position="bottomRight" />;
};

export default GlobalThemeToggle;
