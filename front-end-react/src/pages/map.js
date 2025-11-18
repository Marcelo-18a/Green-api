import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
import Loading from "@/components/Loading";
import { axiosConfig } from "@/utils/auth";
import styles from "@/styles/MapPage.module.css";

export default function MapPage() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        console.log("🔍 Fazendo requisição para a API...");
        const response = await axios.get(
          "http://localhost:4000/leafsamples",
          axiosConfig
        );

        console.log("📡 Resposta da API:", response.data);
        console.log("📋 Amostras recebidas:", response.data.samples);
        console.log(
          "📊 Quantidade de amostras:",
          response.data.samples?.length || 0
        );

        const samplesData = response.data.samples || [];
        setSamples(samplesData);
        setError(null);

        // Log detalhado das amostras
        if (samplesData.length > 0) {
          console.log("🧪 Primeira amostra como exemplo:", samplesData[0]);
          const withLocation = samplesData.filter(
            (s) => s.localizacao?.latitude
          );
          console.log("📍 Amostras com localização:", withLocation.length);
          console.log(
            "📍 Exemplo de localização:",
            withLocation[0]?.localizacao
          );
        }
      } catch (error) {
        console.error("❌ Erro ao carregar amostras:", error);
        setError("Erro ao carregar dados das amostras. Tente novamente.");
        setSamples([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const refreshSamples = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/leafsamples",
        axiosConfig
      );
      setSamples(response.data.samples || []);
      setError(null);
    } catch (error) {
      console.error("Erro ao recarregar amostras:", error);
      setError("Erro ao recarregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mapa de Amostras - Green Leaf &copy; 2025</title>
        <meta
          name="description"
          content="Visualização geográfica das amostras de folhas analisadas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Menu />
        <Container>
          <div className={styles.mapPageContent}>
            <div className={styles.header}>
              <h1>Mapa de Distribuição das Amostras</h1>
              <p>
                Visualize geograficamente as amostras coletadas e seus níveis de
                infecção. O mapa mostra sua localização atual e exibe um heatmap
                baseado nos dados das análises.
              </p>
              <button
                className={styles.refreshButton}
                onClick={refreshSamples}
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Atualizar Dados"}
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <p>⚠️ {error}</p>
                <button onClick={refreshSamples}>Tentar Novamente</button>
              </div>
            )}

            <div className={styles.mapSection}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <Loading loading={loading} />
                  <p>Carregando dados das amostras...</p>
                </div>
              ) : (
                <>
                  <div className={styles.mapInfo}>
                    <div className={styles.infoCard}>
                      <h3>📊 Estatísticas</h3>
                      <ul>
                        <li>
                          <strong>Total de amostras:</strong> {samples.length}
                        </li>
                        <li>
                          <strong>Amostras com localização:</strong>{" "}
                          {
                            samples.filter((s) => s.localizacao?.latitude)
                              .length
                          }
                        </li>
                        <li>
                          <strong>Amostras infectadas:</strong>{" "}
                          {
                            samples.filter(
                              (s) => s.analise?.porcentagem_area_afetada > 0
                            ).length
                          }
                        </li>
                      </ul>
                    </div>

                    <div className={styles.infoCard}>
                      <h3>🗺️ Como usar</h3>
                      <ul>
                        <li>
                          O mapa centraliza automaticamente na sua localização
                        </li>
                        <li>
                          Clique nos marcadores para ver detalhes das amostras
                        </li>
                        <li>
                          O heatmap mostra áreas com maior concentração de
                          infecção
                        </li>
                        <li>
                          Use os controles de zoom para explorar diferentes
                          regiões
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Map samples={samples} />
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
