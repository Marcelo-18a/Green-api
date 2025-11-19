import Head from "next/head";
import Layout from "@/components/Layout";
import CreateContent from "@/components/CreateContent";

export default function CreatePage() {
  return (
    <>
      <Head>
        <title>Cadastrar Folhas - Green Leaf &copy; 2025</title>
        <meta
          name="description"
          content="Cadastro de amostras de folhas para análise"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CreateContent />
      </Layout>
    </>
  );
}
