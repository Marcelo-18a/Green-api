import Head from "next/head";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard - Green Leaf &copy; 2025</title>
        <meta
          name="description"
          content="Dashboard de análise de amostras de folhas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Dashboard />
      </Layout>
    </>
  );
}
