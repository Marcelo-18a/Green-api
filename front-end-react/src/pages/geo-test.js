import Head from "next/head";
import { useState, useEffect } from "react";

export default function GeoTest() {
  const [status, setStatus] = useState("Aguardando...");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [tests, setTests] = useState([]);

  const addTest = (testName, result, details = "") => {
    setTests((prev) => [
      ...prev,
      {
        test: testName,
        result,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  useEffect(() => {
    runLocationTests();
  }, []);

  const runLocationTests = async () => {
    setTests([]);
    setStatus("Executando testes...");

    // Teste 1: Verificar se geolocalização está disponível
    if ("geolocation" in navigator) {
      addTest(
        "Disponibilidade da API",
        "✅ PASS",
        "navigator.geolocation está disponível"
      );
    } else {
      addTest(
        "Disponibilidade da API",
        "❌ FAIL",
        "navigator.geolocation não encontrado"
      );
      setStatus("Geolocalização não suportada");
      return;
    }

    // Teste 2: Verificar HTTPS
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";
    if (isSecure) {
      addTest(
        "Conexão Segura",
        "✅ PASS",
        `Protocolo: ${window.location.protocol}`
      );
    } else {
      addTest("Conexão Segura", "⚠️ WARN", "HTTPS requerido em produção");
    }

    // Teste 3: Teste básico de geolocalização
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setLocation(coords);
      addTest(
        "Obtenção de Localização",
        "✅ PASS",
        `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(
          6
        )}, Precisão: ${coords.accuracy}m`
      );
      setStatus("Geolocalização funcionando!");
    } catch (err) {
      let errorMsg = "";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMsg = "Permissão negada pelo usuário";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMsg = "Posição indisponível";
          break;
        case err.TIMEOUT:
          errorMsg = "Tempo limite excedido";
          break;
        default:
          errorMsg = "Erro desconhecido";
      }

      addTest("Obtenção de Localização", "❌ FAIL", errorMsg);
      setError(err);

      // Teste 4: Fallback com IP
      try {
        setStatus("Tentando localização via IP...");
        const response = await fetch("https://ipapi.co/json/");
        const ipData = await response.json();

        if (ipData.latitude && ipData.longitude) {
          addTest(
            "Localização via IP",
            "✅ PASS",
            `${ipData.city}, ${ipData.region} (${ipData.latitude}, ${ipData.longitude})`
          );
          setLocation({
            lat: ipData.latitude,
            lng: ipData.longitude,
            accuracy: "Aproximada (IP)",
          });
        } else {
          addTest("Localização via IP", "❌ FAIL", "Dados incompletos");
        }
      } catch (ipError) {
        addTest("Localização via IP", "❌ FAIL", "Erro na requisição");
      }
    }

    setStatus("Testes concluídos");
  };

  const testHighAccuracy = () => {
    setStatus("Testando alta precisão...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addTest(
          "Alta Precisão",
          "✅ PASS",
          `Precisão: ${position.coords.accuracy}m, Tempo: ${
            Date.now() % 100000
          }ms`
        );
        setStatus("Teste de alta precisão concluído");
      },
      (error) => {
        addTest("Alta Precisão", "❌ FAIL", `Erro: ${error.message}`);
        setStatus("Teste de alta precisão falhou");
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };

  return (
    <>
      <Head>
        <title>Teste de Geolocalização - Green Leaf</title>
      </Head>

      <div
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>🧪 Teste de Geolocalização</h1>

        <div
          style={{
            background: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>Status: {status}</h2>

          {location && (
            <div style={{ marginTop: "10px" }}>
              <h3>📍 Localização Detectada:</h3>
              <p>
                <strong>Latitude:</strong> {location.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {location.lng}
              </p>
              <p>
                <strong>Precisão:</strong> {location.accuracy}
              </p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={runLocationTests}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            🔄 Executar Testes Novamente
          </button>

          <button
            onClick={testHighAccuracy}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🎯 Testar Alta Precisão
          </button>
        </div>

        <h2>📊 Resultados dos Testes</h2>
        <div
          style={{
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {tests.map((test, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                borderBottom:
                  index < tests.length - 1 ? "1px solid #dee2e6" : "none",
                background: test.result.includes("PASS")
                  ? "#d4edda"
                  : test.result.includes("WARN")
                  ? "#fff3cd"
                  : "#f8d7da",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <strong>{test.test}</strong>
                <span>{test.result}</span>
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {test.details}
              </div>
              <div style={{ fontSize: "12px", color: "#999" }}>
                {test.timestamp}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e7f3ff",
            border: "1px solid #b8daff",
            borderRadius: "8px",
          }}
        >
          <h3>💡 Dicas para Resolver Problemas:</h3>
          <ul>
            <li>Verifique se o GPS está habilitado no dispositivo</li>
            <li>
              Permita acesso à localização quando solicitado pelo navegador
            </li>
            <li>
              Em dispositivos móveis, verifique as configurações de privacidade
            </li>
            <li>Tente em uma aba privada/incógnita</li>
            <li>Limpe o cache e cookies do navegador</li>
            <li>Se usar VPN, tente desabilitar temporariamente</li>
            <li>Verifique se não há bloqueadores de anúncios interferindo</li>
          </ul>
        </div>
      </div>
    </>
  );
}
