import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import styles from "./Dashboard.module.css";
import Loading from "../Loading";
import { axiosConfig } from "@/utils/auth";

const Dashboard = () => {
  // notificações removidas do Dashboard (logs em substituição)
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all"); // all, week, month, year
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byInfectionLevel: {},
    byState: {},
    byBacteria: {},
    avgConfidence: 0,
    avgAffectedArea: 0,
    recentSamples: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch samples and statistics in parallel
        const [samplesResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:4000/leafsamples", axiosConfig),
          axios.get(
            "http://localhost:4000/leafsamples/stats/dashboard",
            axiosConfig
          ),
        ]);

        setSamples(samplesResponse.data.samples);

        // Use API statistics if available, otherwise calculate locally
        if (statsResponse.data.stats) {
          setStats(statsResponse.data.stats);
        } else {
          calculateStats(samplesResponse.data.samples);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        // Notificação removida: manter log para depuração
        // Fallback to local calculation if API fails
        try {
          const response = await axios.get(
            "http://localhost:4000/leafsamples",
            axiosConfig
          );
          setSamples(response.data.samples);
          calculateStats(response.data.samples);
        } catch (fallbackError) {
          console.error("Erro no fallback:", fallbackError);
          // Notificação removida: manter log para depuração
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter samples based on date
  useEffect(() => {
    filterSamplesByDate();
  }, [samples, dateFilter]);

  const filterSamplesByDate = () => {
    if (dateFilter === "all") {
      setFilteredSamples(samples);
      calculateStats(samples);
      return;
    }

    const now = new Date();
    let cutoffDate;

    switch (dateFilter) {
      case "week":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        setFilteredSamples(samples);
        calculateStats(samples);
        return;
    }

    const filtered = samples.filter((sample) => {
      const sampleDate = new Date(sample.data_coleta);
      return sampleDate >= cutoffDate;
    });

    setFilteredSamples(filtered);
    calculateStats(filtered);
  };

  const exportToExcel = () => {
    try {
      // Criar dados formatados para Excel
      const excelData = filteredSamples.map((sample) => ({
        "Código da Amostra": sample.codigo_amostra || "N/A",
        "Data de Coleta": sample.data_coleta
          ? new Date(sample.data_coleta).toLocaleDateString("pt-BR")
          : "N/A",
        Estado: sample.localizacao?.estado || "N/A",
        Município: sample.localizacao?.municipio || "N/A",
        Espécie: sample.especie || "N/A",
        "Coletado Por": sample.coletado_por || "N/A",
        "Nível de Infecção": sample.analise?.grau_infeccao || "N/A",
        "Área Afetada (%)": sample.analise?.porcentagem_area_afetada || "N/A",
        "Confiabilidade (%)": sample.analise?.confiabilidade_modelo || "N/A",
        "Bactéria Detectada": sample.analise?.bacteria_detectada || "N/A",
        "Data da Análise": sample.analise?.data_analise
          ? new Date(sample.analise.data_analise).toLocaleDateString("pt-BR")
          : "N/A",
        Latitude: sample.localizacao?.latitude || "N/A",
        Longitude: sample.localizacao?.longitude || "N/A",
      }));

      // Criar planilha com dados
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Criar dados de estatísticas para uma segunda aba
      const statsData = [
        ["Estatística", "Valor"],
        ["Total de Amostras", stats.total],
        ["Confiabilidade Média (%)", stats.avgConfidence],
        ["Área Afetada Média (%)", stats.avgAffectedArea],
        ["Amostras Recentes (7 dias)", stats.recentSamples],
        ["", ""],
        ["Distribuição por Nível de Infecção", ""],
        ...Object.entries(stats.byInfectionLevel).map(([key, value]) => [
          key,
          value,
        ]),
        ["", ""],
        ["Distribuição por Estado", ""],
        ...Object.entries(stats.byState).map(([key, value]) => [key, value]),
        ["", ""],
        ["Bactérias Detectadas", ""],
        ...Object.entries(stats.byBacteria).map(([key, value]) => [key, value]),
      ];

      const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);

      // Criar workbook com múltiplas abas
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Amostras");
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Estatísticas");

      // Configurar largura das colunas para melhor visualização
      const columnWidths = [
        { wch: 15 }, // Código da Amostra
        { wch: 12 }, // Data de Coleta
        { wch: 15 }, // Estado
        { wch: 15 }, // Município
        { wch: 20 }, // Espécie
        { wch: 20 }, // Coletado Por
        { wch: 18 }, // Nível de Infecção
        { wch: 15 }, // Área Afetada
        { wch: 18 }, // Confiabilidade
        { wch: 25 }, // Bactéria Detectada
        { wch: 15 }, // Data da Análise
        { wch: 12 }, // Latitude
        { wch: 12 }, // Longitude
      ];

      worksheet["!cols"] = columnWidths;

      // Configurar largura das colunas para aba de estatísticas
      statsWorksheet["!cols"] = [
        { wch: 30 }, // Estatística
        { wch: 15 }, // Valor
      ];

      // Gerar nome do arquivo com data e filtro aplicado
      const dateStr = new Date().toISOString().split("T")[0];
      const filterStr =
        dateFilter === "all" ? "completo" : `filtro-${dateFilter}`;
      const filename = `green_leaf_dashboard_${filterStr}_${dateStr}.xlsx`;

      // Fazer download do arquivo
      XLSX.writeFile(workbook, filename);

      // Notificação removida: log de sucesso
      console.log(`Arquivo exportado com sucesso: ${filename}`);
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      // Notificação removida: manter log de erro
    }
  };

  const calculateStats = (samplesData) => {
    if (!samplesData || samplesData.length === 0) {
      return;
    }

    const stats = {
      total: samplesData.length,
      byInfectionLevel: {},
      byState: {},
      byBacteria: {},
      avgConfidence: 0,
      avgAffectedArea: 0,
      recentSamples: 0,
    };

    let totalConfidence = 0;
    let totalAffectedArea = 0;
    let confidenceCount = 0;
    let areaCount = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    samplesData.forEach((sample) => {
      // Nível de infecção
      const infectionLevel = sample.analise?.grau_infeccao || "Não definido";
      stats.byInfectionLevel[infectionLevel] =
        (stats.byInfectionLevel[infectionLevel] || 0) + 1;

      // Estado
      const state = sample.localizacao?.estado || "Não informado";
      stats.byState[state] = (stats.byState[state] || 0) + 1;

      // Bactéria
      const bacteria = sample.analise?.bacteria_detectada || "Não detectada";
      stats.byBacteria[bacteria] = (stats.byBacteria[bacteria] || 0) + 1;

      // Confiabilidade média
      if (sample.analise?.confiabilidade_modelo) {
        totalConfidence += sample.analise.confiabilidade_modelo;
        confidenceCount++;
      }

      // Área afetada média
      if (sample.analise?.porcentagem_area_afetada) {
        totalAffectedArea += sample.analise.porcentagem_area_afetada;
        areaCount++;
      }

      // Amostras recentes
      const sampleDate = new Date(sample.data_coleta);
      if (sampleDate >= oneWeekAgo) {
        stats.recentSamples++;
      }
    });

    stats.avgConfidence =
      confidenceCount > 0 ? (totalConfidence / confidenceCount).toFixed(1) : 0;
    stats.avgAffectedArea =
      areaCount > 0 ? (totalAffectedArea / areaCount).toFixed(1) : 0;

    setStats(stats);
  };

  const renderChart = (data, title, colorClass) => {
    const entries = Object.entries(data);
    const maxValue = Math.max(...entries.map(([, value]) => value));

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chart}>
          {entries.map(([key, value]) => (
            <div key={key} className={styles.chartItem}>
              <div className={styles.chartLabel}>{key}</div>
              <div className={styles.chartBarContainer}>
                <div
                  className={`${styles.chartBar} ${styles[colorClass]}`}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
                <span className={styles.chartValue}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard de Análise de Folhas</h1>
        <p className={styles.subtitle}>
          Visão geral dos dados coletados e análises realizadas
        </p>

        <div className={styles.controls}>
          <button
            onClick={exportToExcel}
            className={styles.exportButton}
            disabled={filteredSamples.length === 0}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtro de data */}
      <div className={styles.dateFilter}>
        <label htmlFor="dateRange" className={styles.dateLabel}>
          Filtrar por data:
        </label>
        <select
          id="dateRange"
          className={styles.dateSelect}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="week">Última semana</option>
          <option value="month">Último mês</option>
          <option value="year">Último ano</option>
        </select>
      </div>

      {/* Cards de estatísticas principais */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧬</div>
          <div className={styles.statContent}>
            <h3>{stats.total}</h3>
            <p>Total de Amostras</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>{stats.avgConfidence}%</h3>
            <p>Confiabilidade Média</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🍃</div>
          <div className={styles.statContent}>
            <h3>{stats.avgAffectedArea}%</h3>
            <p>Área Afetada Média</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <h3>{stats.recentSamples}</h3>
            <p>Amostras Recentes</p>
            <p>(7 dias)</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        {renderChart(
          stats.byInfectionLevel,
          "Distribuição por Nível de Infecção",
          "red"
        )}
        {renderChart(stats.byState, "Distribuição por Estado", "blue")}
        {renderChart(stats.byBacteria, "Bactérias Detectadas", "purple")}
      </div>

      {/* Análise Avançada */}
      <div className={styles.advancedSection}>
        <h3 className={styles.sectionTitle}>Análise Avançada</h3>

        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <h4>🚨 Alertas de Risco</h4>
            <div className={styles.alertsList}>
              {stats.byInfectionLevel["Grave"] > 0 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>⚠️</span>
                  <span>
                    {stats.byInfectionLevel["Grave"]} amostras com infecção
                    grave detectada
                  </span>
                </div>
              )}
              {stats.avgConfidence < 80 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>📊</span>
                  <span>
                    Confiabilidade média baixa ({stats.avgConfidence}%)
                  </span>
                </div>
              )}
              {stats.avgAffectedArea > 50 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>🍃</span>
                  <span>
                    Área afetada média alta ({stats.avgAffectedArea}%)
                  </span>
                </div>
              )}
              {Object.keys(stats.byInfectionLevel).length === 0 && (
                <div className={styles.noAlerts}>
                  <span>✅ Nenhum alerta no momento</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.analyticsCard}>
            <h4>📈 Resumo Executivo</h4>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <strong>Estado mais afetado:</strong>{" "}
                {Object.entries(stats.byState).sort(
                  ([, a], [, b]) => b - a
                )[0]?.[0] || "N/A"}
              </div>
              <div className={styles.summaryItem}>
                <strong>Bactéria predominante:</strong>{" "}
                {Object.entries(stats.byBacteria).sort(
                  ([, a], [, b]) => b - a
                )[0]?.[0] || "N/A"}
              </div>
              <div className={styles.summaryItem}>
                <strong>Taxa de amostras recentes:</strong>{" "}
                {stats.total > 0
                  ? Math.round((stats.recentSamples / stats.total) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de amostras recentes */}
      <div className={styles.recentSamples}>
        <h3 className={styles.sectionTitle}>Amostras Recentes</h3>
        <div className={styles.tableContainer}>
          <table className={styles.samplesTable}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Data Coleta</th>
                <th>Estado</th>
                <th>Município</th>
                <th>Nível Infecção</th>
                <th>Área Afetada</th>
                <th>Confiabilidade</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.slice(0, 10).map((sample) => (
                <tr key={sample._id}>
                  <td>{sample.codigo_amostra || "N/A"}</td>
                  <td>
                    {sample.data_coleta
                      ? new Date(sample.data_coleta).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </td>
                  <td>{sample.localizacao?.estado || "N/A"}</td>
                  <td>{sample.localizacao?.municipio || "N/A"}</td>
                  <td>
                    <span
                      className={`${styles.infectionBadge} ${
                        styles[getInfectionClass(sample.analise?.grau_infeccao)]
                      }`}
                    >
                      {sample.analise?.grau_infeccao || "N/A"}
                    </span>
                  </td>
                  <td>
                    {sample.analise?.porcentagem_area_afetada
                      ? `${sample.analise.porcentagem_area_afetada}%`
                      : "N/A"}
                  </td>
                  <td>
                    {sample.analise?.confiabilidade_modelo
                      ? `${sample.analise.confiabilidade_modelo}%`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getInfectionClass = (level) => {
  if (!level) return "unknown";

  const normalized = level
    .toLowerCase()
    .replace(/ã/g, "a")
    .replace(/ç/g, "c")
    .replace(/á|â|à/g, "a")
    .replace(/é|ê/g, "e")
    .replace(/í|î/g, "i")
    .replace(/ó|ô|õ/g, "o")
    .replace(/ú|û/g, "u")
    .trim();

  // Mapear diferentes variações para as classes CSS
  if (["leve", "baixo", "baixa", "minimo", "minima"].includes(normalized)) {
    return "light";
  }
  if (["moderado", "moderada", "medio", "media"].includes(normalized)) {
    return "moderate";
  }
  if (
    [
      "grave",
      "severo",
      "severa",
      "alto",
      "alta",
      "critico",
      "critica",
    ].includes(normalized)
  ) {
    return "severe";
  }

  return "unknown";
};

export default Dashboard;
