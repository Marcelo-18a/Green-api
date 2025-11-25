import LoginContainer from "@/components/LoginContainer";
import RegisterContent from "@/components/RegisterContent";
import { NotificationProvider } from "@/components/Notification/NotificationContext";
import Head from "next/head";

const Register = () => {
  return (
    <NotificationProvider>
      <Head>
        <title>Cadastro - Green API</title>
        <meta name="description" content="Crie sua conta no Green API" />
      </Head>
      <LoginContainer>
        <RegisterContent />
      </LoginContainer>
    </NotificationProvider>
  );
};

export default Register;
