import { useState, useEffect } from "react";
import styles from "@/components/EditContent/EditContent.module.css";
import axios from "axios";
import { axiosConfig } from "@/utils/auth";
import { useNotification } from "../Notification/NotificationContext";

const EditContent = ({ onClose, sample }) => {
  // Estados para os campos da amostra
  const [id, setId] = useState("");
  const [codigoAmostra, setCodigoAmostra] = useState("");
  const [especie, setEspecie] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [coletadoPor, setColetadoPor] = useState("");
  const [localizacao, setLocalizacao] = useState({
    municipio: "",
    estado: "",
    latitude: "",
    longitude: "",
  });
  const [imagemOriginal, setImagemOriginal] = useState("");
  const [grauInfeccao, setGrauInfeccao] = useState("");
  const [bacteriaDetectada, setBacteriaDetectada] = useState("");
  const [porcentagemArea, setPorcentagemArea] = useState("");
  const [confiabilidadeModelo, setConfiabilidadeModelo] = useState("");
  const [dataAnalise, setDataAnalise] = useState("");

  // Estados para geolocalização
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error, denied, manual
  const [locationError, setLocationError] = useState("");
  const [manualLocation, setManualLocation] = useState(false);

  // Hook de notificações
  const { showSuccess, showError, showWarning } = useNotification();

  // Popula os estados quando a amostra é selecionada
  useEffect(() => {
    if (sample) {
      setId(sample._id);
      setCodigoAmostra(sample.codigo_amostra);
      setEspecie(sample.especie);
      setDataColeta(sample.data_coleta ? sample.data_coleta.split("T")[0] : "");
      setColetadoPor(sample.coletado_por);
      setLocalizacao({
        municipio: sample.localizacao?.municipio || "",
        estado: sample.localizacao?.estado || "",
        latitude: sample.localizacao?.latitude?.toString() || "",
        longitude: sample.localizacao?.longitude?.toString() || "",
      });
      setImagemOriginal(sample.imagem_original || "");
      setGrauInfeccao(sample.analise?.grau_infeccao || "");
      setBacteriaDetectada(sample.analise?.bacteria_detectada || "");
      setPorcentagemArea(sample.analise?.porcentagem_area_afetada || "");
      setConfiabilidadeModelo(sample.analise?.confiabilidade_modelo || "");
      setDataAnalise(
        sample.analise?.data_analise
          ? sample.analise.data_analise.split("T")[0]
          : ""
      );
    }
  }, [sample]);

  // Função para obter localização atual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocalizacao((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
          setLocationStatus("success");

          // Tentar obter endereço usando reverse geocoding
          getReverseGeocode(lat, lng);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          let errorMessage = "";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permissão de localização negada";
              setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Localização indisponível";
              setLocationStatus("error");
              break;
            case error.TIMEOUT:
              errorMessage = "Tempo limite excedido";
              setLocationStatus("error");
              break;
            default:
              errorMessage = "Erro desconhecido na geolocalização";
              setLocationStatus("error");
              break;
          }

          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setLocationStatus("error");
      setLocationError("Geolocalização não suportada pelo navegador");
    }
  };

  // Função para obter endereço aproximado
  const getReverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data.address) {
        const city =
          data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";

        setLocalizacao((prev) => ({
          ...prev,
          municipio: city || prev.municipio,
          estado: state || prev.estado,
        }));
      }
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
    }
  };

  // Função para ativar inserção manual de localização
  const enableManualLocation = () => {
    setManualLocation(true);
    setLocationStatus("manual");
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSample = {
      codigo_amostra: codigoAmostra,
      especie,
      data_coleta: dataColeta,
      coletado_por: coletadoPor,
      imagem_original: imagemOriginal,
      localizacao: {
        municipio: localizacao.municipio,
        estado: localizacao.estado,
        latitude: localizacao.latitude
          ? Number(localizacao.latitude)
          : undefined,
        longitude: localizacao.longitude
          ? Number(localizacao.longitude)
          : undefined,
      },
      analise: {
        bacteria_detectada: bacteriaDetectada,
        grau_infeccao: grauInfeccao || undefined,
        porcentagem_area_afetada:
          porcentagemArea !== "" && porcentagemArea !== null
            ? Number(porcentagemArea)
            : undefined,
        confiabilidade_modelo:
          confiabilidadeModelo !== "" && confiabilidadeModelo !== null
            ? Number(confiabilidadeModelo)
            : undefined,
        data_analise: dataAnalise || undefined,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/leafsamples/${id}`,
        updatedSample,
        axiosConfig
      );
      if (response.status === 200) {
        showSuccess("Amostra alterada com sucesso!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      showError("Erro ao alterar a amostra. Tente novamente.");
    }
  };

  return (
    <div className={styles.editModal}>
      <div className={styles.editContent}>
        <span className={styles.modalClose} onClick={onClose}>
          &times;
        </span>
        <div className="title">
          <h2>Editar Amostra de Folha</h2>
        </div>
        <form id="editForm" onSubmit={handleSubmit}>
          <label>
            Código da Amostra:
            <input
              type="text"
              placeholder="Código da Amostra"
              value={codigoAmostra}
              onChange={(e) => setCodigoAmostra(e.target.value)}
              required
            />
          </label>
          <label>
            Espécie:
            <input
              type="text"
              placeholder="Espécie"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
              required
            />
          </label>
          <label>
            Data da Coleta:
            <input
              type="date"
              placeholder="Data da Coleta"
              value={dataColeta}
              onChange={(e) => setDataColeta(e.target.value)}
              required
            />
          </label>
          <label>
            Coletado por:
            <input
              type="text"
              placeholder="Coletado por"
              value={coletadoPor}
              onChange={(e) => setColetadoPor(e.target.value)}
              required
            />
          </label>

          <div className="subtitle">
            <h3>📍 Localização</h3>

            {/* Botão para obter localização atual */}
            <div className={styles.locationControls}>
              <button
                type="button"
                className={styles.locationBtn}
                onClick={getCurrentLocation}
                disabled={locationStatus === "loading"}
              >
                {locationStatus === "loading"
                  ? "Obtendo..."
                  : "📍 Usar localização atual"}
              </button>

              <button
                type="button"
                className={styles.manualBtn}
                onClick={enableManualLocation}
              >
                ✏️ Editar manualmente
              </button>
            </div>

            {/* Status da geolocalização */}
            <div className={styles.locationStatus}>
              {locationStatus === "loading" && (
                <div className={styles.locationInfo}>
                  <span className={styles.spinner}></span>
                  <span>Obtendo sua localização...</span>
                </div>
              )}

              {locationStatus === "success" && (
                <div className={styles.locationSuccess}>
                  <span>✅ Localização atualizada automaticamente</span>
                </div>
              )}

              {(locationStatus === "denied" || locationStatus === "error") && (
                <div className={styles.locationError}>
                  <span>⚠️ {locationError}</span>
                </div>
              )}

              {locationStatus === "manual" && (
                <div className={styles.locationManual}>
                  <span>📍 Modo de edição manual ativado</span>
                </div>
              )}
            </div>
          </div>

          {/* Campos de coordenadas - mostrar quando em modo manual ou quando há coordenadas */}
          {(manualLocation ||
            locationStatus === "manual" ||
            localizacao.latitude) && (
            <>
              <label>
                Latitude:
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={localizacao.latitude}
                  onChange={(e) =>
                    setLocalizacao({ ...localizacao, latitude: e.target.value })
                  }
                />
              </label>
              <label>
                Longitude:
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={localizacao.longitude}
                  onChange={(e) =>
                    setLocalizacao({
                      ...localizacao,
                      longitude: e.target.value,
                    })
                  }
                />
              </label>
            </>
          )}

          {/* Display das coordenadas */}
          {localizacao.latitude && localizacao.longitude && (
            <div className={styles.locationDisplay}>
              <p>
                <strong>Coordenadas:</strong>{" "}
                {parseFloat(localizacao.latitude).toFixed(6)},{" "}
                {parseFloat(localizacao.longitude).toFixed(6)}
              </p>
            </div>
          )}

          <label>
            Município:
            <input
              type="text"
              placeholder="Município"
              value={localizacao.municipio}
              onChange={(e) =>
                setLocalizacao({ ...localizacao, municipio: e.target.value })
              }
              required
            />
          </label>
          <label>
            Estado:
            <input
              type="text"
              placeholder="Estado"
              value={localizacao.estado}
              onChange={(e) =>
                setLocalizacao({ ...localizacao, estado: e.target.value })
              }
              required
            />
          </label>
          <label>
            URL da Imagem:
            <input
              type="text"
              placeholder="URL da Imagem"
              value={imagemOriginal}
              onChange={(e) => setImagemOriginal(e.target.value)}
            />
          </label>

          <div className="subtitle">
            <h3>🔬 Dados da Análise</h3>
          </div>

          <label>
            Nível de Infecção:
            <input
              type="text"
              placeholder="Nível de Infecção"
              value={grauInfeccao}
              readOnly
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </label>
          <label>
            Bactéria Detectada:
            <input
              type="text"
              placeholder="Bactéria Detectada"
              value={bacteriaDetectada}
              onChange={(e) => setBacteriaDetectada(e.target.value)}
              required
            />
          </label>
          <label>
            Área Afetada:
            <input
              type="number"
              placeholder="Área Afetada"
              value={porcentagemArea}
              readOnly
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </label>
          <label>
            Confiabilidade Modelo:
            <input
              type="number"
              placeholder="Confiabilidade Modelo"
              value={confiabilidadeModelo}
              readOnly
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </label>
          <label>
            Data da Análise:
            <input
              type="date"
              placeholder="Data da Análise"
              value={dataAnalise}
              onChange={(e) => setDataAnalise(e.target.value)}
              required
            />
          </label>

          <input type="submit" value="Alterar" className="btnPrimary" />
        </form>
      </div>
    </div>
  );
};

export default EditContent;
