import { useState, useEffect } from "react";
import styles from "@/components/EditContent/EditContent.module.css";
import axios from "axios";
import { axiosConfig } from "@/utils/auth";

const EditContent = ({ onClose, sample }) => {
  // Estados para os campos da amostra
  const [id, setId] = useState("");
  const [codigoAmostra, setCodigoAmostra] = useState("");
  const [especie, setEspecie] = useState("");
  const [variedade, setVariedade] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [coletadoPor, setColetadoPor] = useState("");
  const [localizacao, setLocalizacao] = useState({ municipio: "", estado: "" });
  const [imagemOriginal, setImagemOriginal] = useState("");
  const [grauInfeccao, setGrauInfeccao] = useState("");
  const [bacteriaDetectada, setBacteriaDetectada] = useState("");
  const [porcentagemArea, setPorcentagemArea] = useState("");
  const [confiabilidadeModelo, setConfiabilidadeModelo] = useState("");
  const [dataAnalise, setDataAnalise] = useState("");

  // Popula os estados quando a amostra é selecionada
  useEffect(() => {
    if (sample) {
      setId(sample._id);
      setCodigoAmostra(sample.codigo_amostra);
      setEspecie(sample.especie);
      setVariedade(sample.variedade);
      setDataColeta(sample.data_coleta ? sample.data_coleta.split("T")[0] : "");
      setColetadoPor(sample.coletado_por);
      setLocalizacao({
        municipio: sample.localizacao?.municipio || "",
        estado: sample.localizacao?.estado || "",
      });
      setImagemOriginal(sample.imagem_original || "");
      setGrauInfeccao(sample.analise?.grau_infeccao || "");
      setBacteriaDetectada(sample.analise?.bacteria_detectada || "");
      setPorcentagemArea(sample.analise?.porcentagem_area_afetada || "");
      setConfiabilidadeModelo(sample.analise?.confiabilidade_modelo || "");
      setDataAnalise(sample.analise?.data_analise ? sample.analise.data_analise.split("T")[0] : "");
    }
  }, [sample]);

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSample = {
      codigo_amostra: codigoAmostra,
      especie,
      variedade,
      data_coleta: dataColeta,
      coletado_por: coletadoPor,
      imagem_original: imagemOriginal,
      localizacao,
      analise: {
        grau_infeccao: grauInfeccao,
        bacteria_detectada: bacteriaDetectada,
        porcentagem_area_afetada: Number(porcentagemArea),
        confiabilidade_modelo: Number(confiabilidadeModelo),
        data_analise: dataAnalise,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/leafSamples/${id}`,
        updatedSample,
        axiosConfig
      );
      if (response.status === 200) {
        alert("A amostra foi alterada com sucesso!");
        onClose();
      }
    } catch (error) {
      console.error(error);
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
          <input type="text" placeholder="Código da Amostra" value={codigoAmostra} onChange={(e) => setCodigoAmostra(e.target.value)} required />
          <input type="text" placeholder="Espécie" value={especie} onChange={(e) => setEspecie(e.target.value)} required />
          <input type="text" placeholder="Variedade" value={variedade} onChange={(e) => setVariedade(e.target.value)} required />
          <input type="date" placeholder="Data da Coleta" value={dataColeta} onChange={(e) => setDataColeta(e.target.value)} required />
          <input type="text" placeholder="Coletado por" value={coletadoPor} onChange={(e) => setColetadoPor(e.target.value)} required />
          <input type="text" placeholder="Município" value={localizacao.municipio} onChange={(e) => setLocalizacao({ ...localizacao, municipio: e.target.value })} required />
          <input type="text" placeholder="Estado" value={localizacao.estado} onChange={(e) => setLocalizacao({ ...localizacao, estado: e.target.value })} required />
          <input type="text" placeholder="URL da Imagem" value={imagemOriginal} onChange={(e) => setImagemOriginal(e.target.value)} />

          <input type="text" placeholder="Nível de Infecção" value={grauInfeccao} onChange={(e) => setGrauInfeccao(e.target.value)} required />
          <input type="text" placeholder="Bactéria Detectada" value={bacteriaDetectada} onChange={(e) => setBacteriaDetectada(e.target.value)} required />
          <input type="number" placeholder="% Área Afetada" value={porcentagemArea} onChange={(e) => setPorcentagemArea(e.target.value)} required />
          <input type="number" placeholder="% Confiabilidade Modelo" value={confiabilidadeModelo} onChange={(e) => setConfiabilidadeModelo(e.target.value)} required />
          <input type="date" placeholder="Data da Análise" value={dataAnalise} onChange={(e) => setDataAnalise(e.target.value)} required />

          <input type="submit" value="Alterar" className="btnPrimary" />
        </form>
      </div>
    </div>
  );
};

export default EditContent;
