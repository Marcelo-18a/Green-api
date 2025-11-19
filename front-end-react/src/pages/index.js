import Head from "next/head";
import LoginContainer from "@/components/LoginContainer";
import LoginContent from "@/components/LoginContent";

export default function Home() {
  return (
    <>
      <Head>
        <title>Green Leaf &copy; 2025</title>
        <meta
          name="description"
          content="Sistema de Análise de Folhas - Green Leaf"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ height: "100vh", overflow: "hidden" }}>
        <LoginContainer>
          <LoginContent />
        </LoginContainer>
      </main>
    </>
  );
}
