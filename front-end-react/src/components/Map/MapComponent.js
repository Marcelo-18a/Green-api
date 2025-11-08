import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import styles from "./Map.module.css";

// Fix para os ícones do Leaflet no Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapComponent = ({ center, samples, heatmapData, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [mapStats, setMapStats] = useState({
    totalSamples: 0,
    affectedSamples: 0,
    averageInfection: 0,
  });

  // Calcula estatísticas do mapa
  useEffect(() => {
    const totalSamples = samples.length;
    const affectedSamples = samples.filter(
      (sample) => sample.analise?.porcentagem_area_afetada > 0
    ).length;
    const averageInfection =
      samples.reduce((sum, sample) => {
        return sum + (sample.analise?.porcentagem_area_afetada || 0);
      }, 0) / totalSamples || 0;

    setMapStats({
      totalSamples,
      affectedSamples,
      averageInfection: Math.round(averageInfection * 100) / 100,
    });
  }, [samples]);

  // Inicializa o mapa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Criar o mapa
    const map = L.map(mapRef.current).setView([center.lat, center.lng], 10);

    // Adicionar tile layer do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualiza o centro do mapa
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView([center.lat, center.lng], 10);
    }
  }, [center]);

  // Adiciona marcador do usuário
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    // Remove marcador anterior se existir
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    // Ícone customizado para o usuário
    const userIcon = L.divIcon({
      className: styles.userMarker,
      html: `<div class="${styles.userMarkerInner}">📍</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Adiciona novo marcador do usuário
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
    })
      .addTo(mapInstanceRef.current)
      .bindPopup("<b>Sua localização atual</b>");
  }, [userLocation]);

  // Adiciona marcadores das amostras
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove marcadores anteriores
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Adiciona novos marcadores
    samples.forEach((sample) => {
      if (sample.localizacao?.latitude && sample.localizacao?.longitude) {
        const { latitude, longitude } = sample.localizacao;
        const infection = sample.analise?.porcentagem_area_afetada || 0;

        // Define cor do marcador baseado no nível de infecção
        let markerColor = "#28a745"; // Verde para baixa infecção
        if (infection > 30) markerColor = "#ffc107"; // Amarelo para média
        if (infection > 60) markerColor = "#dc3545"; // Vermelho para alta

        const customIcon = L.divIcon({
          className: styles.customMarker,
          html: `<div style="background-color: ${markerColor};" class="${
            styles.customMarkerInner
          }">${Math.round(infection)}%</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const popupContent = `
          <div class="${styles.popupContent}">
            <h4>${sample.codigo_amostra}</h4>
            <p><strong>Espécie:</strong> ${sample.especie}</p>
            <p><strong>Variedade:</strong> ${sample.variedade || "N/A"}</p>
            <p><strong>Local:</strong> ${sample.localizacao.municipio}, ${
          sample.localizacao.estado
        }</p>
            <p><strong>Data da coleta:</strong> ${new Date(
              sample.data_coleta
            ).toLocaleDateString("pt-BR")}</p>
            <p><strong>Bactéria:</strong> ${
              sample.analise?.bacteria_detectada
            }</p>
            <p><strong>Nível de infecção:</strong> ${
              sample.analise?.grau_infeccao
            }</p>
            <p><strong>Área afetada:</strong> ${infection}%</p>
            <p><strong>Confiabilidade:</strong> ${
              sample.analise?.confiabilidade_modelo
            }%</p>
            ${
              sample.imagem_original
                ? `<img src="${sample.imagem_original}" alt="Amostra" style="width: 100%; max-width: 200px; margin-top: 10px; border-radius: 4px;">`
                : ""
            }
          </div>
        `;

        const marker = L.marker([latitude, longitude], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(popupContent);

        markersRef.current.push(marker);
      }
    });
  }, [samples]);

  // Adiciona heatmap
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove heatmap anterior se existir
    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current);
    }

    // Adiciona novo heatmap se houver dados
    if (heatmapData && heatmapData.length > 0) {
      heatLayerRef.current = L.heatLayer(heatmapData, {
        radius: 50,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: "green",
          0.3: "yellow",
          0.6: "orange",
          1.0: "red",
        },
      }).addTo(mapInstanceRef.current);
    }
  }, [heatmapData]);

  return (
    <div className={styles.mapWrapper}>
      {/* Estatísticas do mapa */}
      <div className={styles.mapStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{mapStats.totalSamples}</span>
          <span className={styles.statLabel}>Total de amostras</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{mapStats.affectedSamples}</span>
          <span className={styles.statLabel}>Amostras infectadas</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{mapStats.averageInfection}%</span>
          <span className={styles.statLabel}>Infecção média</span>
        </div>
      </div>

      {/* Legenda */}
      <div className={styles.mapLegend}>
        <h4>Legenda</h4>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: "#28a745" }}
          ></div>
          <span>Baixa infecção (&lt;30%)</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: "#ffc107" }}
          ></div>
          <span>Média infecção (30-60%)</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: "#dc3545" }}
          ></div>
          <span>Alta infecção (&gt;60%)</span>
        </div>
        <div className={styles.legendItem}>
          <span style={{ fontSize: "18px" }}>📍</span>
          <span>Sua localização</span>
        </div>
      </div>

      {/* Container do mapa */}
      <div ref={mapRef} className={styles.map}></div>
    </div>
  );
};

export default MapComponent;
