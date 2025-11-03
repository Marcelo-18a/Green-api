import { useState } from "react";
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

  const router = useRouter();

  // 🔹 Submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (codigo_amostra && variedade && coletado_por && data_coleta) {
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
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
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

        <h3>📍 Localização</h3>
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          className="inputPrimary"
          onChange={(e) => setLatitude(e.target.value)}
          value={latitude}
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          className="inputPrimary"
          onChange={(e) => setLongitude(e.target.value)}
          value={longitude}
        />
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
