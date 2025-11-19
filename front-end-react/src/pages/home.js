import Head from "next/head";
import Layout from "@/components/Layout";
import HomeContent from "@/components/HomeContent";

export default function Homepage() {
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
      <Layout>
        <HomeContent />
      </Layout>
    </>
  );
}
