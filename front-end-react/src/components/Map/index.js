import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./Map.module.css";

// Importação dinâmica para evitar problemas de SSR
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Carregando mapa...</div>,
});

const Map = ({ samples = [] }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Localização padrão (São Paulo)
  const defaultLocation = { lat: -23.5505, lng: -46.6333 };

  useEffect(() => {
    // Função para obter geolocalização
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            setIsLoading(false);
            console.log("Localização obtida:", location);
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
            let errorMessage = "Erro desconhecido na geolocalização";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Permissão de localização negada pelo usuário";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Localização indisponível";
                break;
              case error.TIMEOUT:
                errorMessage = "Tempo limite para obter localização excedido";
                break;
            }

            setLocationError(errorMessage);
            setUserLocation(defaultLocation);
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutos
          }
        );
      } else {
        setLocationError("Geolocalização não é suportada por este navegador");
        setUserLocation(defaultLocation);
        setIsLoading(false);
      }
    };

    getUserLocation();
  }, []);

  // Processa os dados das amostras para o heatmap
  const processHeatmapData = (samples) => {
    console.log("🔍 Processando dados das amostras:", samples);
    console.log("📊 Total de amostras recebidas:", samples.length);

    // Vamos ver a estrutura dos dados
    if (samples.length > 0) {
      console.log("🧪 Exemplo de amostra (primeira):", samples[0]);
      console.log(
        "📍 Localizações encontradas:",
        samples.map((s) => s.localizacao)
      );
      console.log(
        "🦠 Análises encontradas:",
        samples.map((s) => s.analise)
      );
    }

    const filteredSamples = samples.filter((sample) => {
      const hasLocation =
        sample.localizacao?.latitude && sample.localizacao?.longitude;
      const hasInfection = sample.analise?.porcentagem_area_afetada;

      console.log(`📋 Amostra ${sample.codigo_amostra || "sem código"}:`, {
        hasLocation,
        hasInfection,
        lat: sample.localizacao?.latitude,
        lng: sample.localizacao?.longitude,
        infection: sample.analise?.porcentagem_area_afetada,
      });

      return hasLocation && hasInfection;
    });

    console.log("✅ Amostras filtradas para heatmap:", filteredSamples.length);

    return filteredSamples.map((sample) => [
      sample.localizacao.latitude,
      sample.localizacao.longitude,
      sample.analise.porcentagem_area_afetada / 100, // Normalizar para 0-1
    ]);
  };

  return (
    <div className={styles.mapContainer}>
      {locationError && (
        <div className={styles.locationError}>
          <p>⚠️ {locationError}</p>
          <p>Exibindo mapa padrão (São Paulo)</p>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Obtendo sua localização...</p>
        </div>
      ) : (
        <MapComponent
          center={userLocation || defaultLocation}
          samples={samples}
          heatmapData={processHeatmapData(samples)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
};

export default Map;
