import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/components/CreateContent/CreateContent.module.css";
import axios from "axios";
import { axiosConfig } from "@/utils/auth";

const CreateContent = () => {
  // 🔹 Estados da amostra de folha
  const [codigo_amostra, setCodigoAmostra] = useState("");
  const [especie, setEspecie] = useState("Manihot esculenta");
  const [variedade, setVariedade] = useState("");
  const [data_coleta, setDataColeta] = useState("");
  const [coletado_por, setColetadoPor] = useState("");
  const [imagem_original, setImagemOriginal] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [estado, setEstado] = useState("");

  // 🔹 Estados para geolocalização
  const [locationStatus, setLocationStatus] = useState("loading"); // loading, success, error, denied
  const [locationError, setLocationError] = useState("");
  const [manualLocation, setManualLocation] = useState(false);

  const router = useRouter();

  // 🔹 Obter localização automática ao carregar o componente
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        setLocationStatus("loading");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat.toString());
            setLongitude(lng.toString());
            setLocationStatus("success");

            // Tentar obter endereço usando reverse geocoding (opcional)
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

    getCurrentLocation();
  }, []);

  // 🔹 Função para obter endereço aproximado (opcional)
  const getReverseGeocode = async (lat, lng) => {
    try {
      // Usando API gratuita do OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data.address) {
        const city =
          data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";

        if (city) setMunicipio(city);
        if (state) setEstado(state);
      }
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
      // Não é crítico, então não mostramos erro ao usuário
    }
  };

  // 🔹 Função para ativar inserção manual de localização
  const enableManualLocation = () => {
    setManualLocation(true);
    setLatitude("");
    setLongitude("");
    setLocationStatus("manual");
  };

  // 🔹 Submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação dos campos obrigatórios
    if (!codigo_amostra || !variedade || !coletado_por || !data_coleta) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação da localização
    if (!latitude || !longitude) {
      alert(
        "Por favor, aguarde a obtenção da localização ou insira manualmente."
      );
      return;
    }

    const sample = {
      codigo_amostra,
      especie,
      variedade,
      data_coleta,
      coletado_por,
      imagem_original,
      localizacao: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        municipio,
        estado,
      },
      // 🔸 NÃO enviamos "analise" — o back gera aleatoriamente
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/leafsamples",
        sample,
        axiosConfig
      );
      if (response.status === 201) {
        alert("Amostra cadastrada com sucesso!");
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar amostra.");
    }
  };

  return (
    <div className={styles.createContent}>
      <div className="title">
        <h2>Cadastrar nova amostra de folha</h2>
      </div>

      <form id="createForm" className="formPrimary" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Código da amostra"
          className="inputPrimary"
          onChange={(e) => setCodigoAmostra(e.target.value)}
          value={codigo_amostra}
        />
        <input
          type="text"
          placeholder="Variedade da mandioca (ex: IAC 90)"
          className="inputPrimary"
          onChange={(e) => setVariedade(e.target.value)}
          value={variedade}
        />
        <input
          type="date"
          placeholder="Data da coleta"
          className="inputPrimary"
          onChange={(e) => setDataColeta(e.target.value)}
          value={data_coleta}
        />
        <input
          type="text"
          placeholder="Coletado por"
          className="inputPrimary"
          onChange={(e) => setColetadoPor(e.target.value)}
          value={coletado_por}
        />
        <input
          type="text"
          placeholder="URL da imagem original"
          className="inputPrimary"
          onChange={(e) => setImagemOriginal(e.target.value)}
          value={imagem_original}
        />

        <div className="subtitle">
          <h2>📍 Localização</h2>

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
                <span>✅ Localização obtida automaticamente</span>
                <button
                  type="button"
                  className={styles.manualBtn}
                  onClick={enableManualLocation}
                >
                  Inserir manualmente
                </button>
              </div>
            )}

            {(locationStatus === "denied" || locationStatus === "error") && (
              <div className={styles.locationError}>
                <span>⚠️ {locationError}</span>
                <button
                  type="button"
                  className={styles.manualBtn}
                  onClick={enableManualLocation}
                >
                  Inserir manualmente
                </button>
              </div>
            )}

            {locationStatus === "manual" && (
              <div className={styles.locationManual}>
                <span>📍 Inserção manual ativada</span>
              </div>
            )}
          </div>
        </div>

        {/* Campos de localização - mostrar apenas se necessário */}
        {(manualLocation || locationStatus === "manual") && (
          <>
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              className="inputPrimary"
              onChange={(e) => setLatitude(e.target.value)}
              value={latitude}
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              className="inputPrimary"
              onChange={(e) => setLongitude(e.target.value)}
              value={longitude}
              required
            />
          </>
        )}

        {/* Campos de localização complementares */}
        {latitude && longitude && (
          <div className={styles.locationDisplay}>
            <p>
              <strong>Coordenadas:</strong> {parseFloat(latitude).toFixed(6)},{" "}
              {parseFloat(longitude).toFixed(6)}
            </p>
          </div>
        )}
        <input
          type="text"
          placeholder="Município"
          className="inputPrimary"
          onChange={(e) => setMunicipio(e.target.value)}
          value={municipio}
        />
        <input
          type="text"
          placeholder="Estado"
          className="inputPrimary"
          onChange={(e) => setEstado(e.target.value)}
          value={estado}
        />

        <input
          type="submit"
          value="Cadastrar Amostra"
          id="createBtn"
          className="btnPrimary"
        />
      </form>
    </div>
  );
};

export default CreateContent;
