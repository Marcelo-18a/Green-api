import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/components/HomeContent/HomeContent.module.css";
import Loading from "../Loading";
import EditContent from "../EditContent";
import { axiosConfig } from "@/utils/auth";

const HomeContent = () => {
  const [samples, setSamples] = useState([]); // Lista de amostras
  const [loading, setLoading] = useState(true);
  const [selectedSample, setSelectedSample] = useState(null); // Amostra selecionada para edição

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await axios.get("http://localhost:4000/leafSamples", axiosConfig);
        setSamples(response.data.samples);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  // Função para deletar uma amostra
  const deleteSample = async (sampleId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/leafSamples/${sampleId}`,
        axiosConfig
      );
      if (response.status === 204) {
        alert("A amostra foi excluída com sucesso.");
        setSamples(samples.filter((sample) => sample._id !== sampleId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (sample) => {
    setSelectedSample(sample);
  };

  // Função para fechar o modal de edição
  const closeEditModal = () => {
    setSelectedSample(null);
  };

  return (
    <div className={styles.homeContent}>
      {/* CARD LISTA DE AMOSTRAS */}
      <div className={styles.listSamplesCard}>
        {/* TITLE */}
        <div className={styles.title}>
          <h2>Lista de amostras de folhas</h2>
        </div>
        <Loading loading={loading} />
        <div className={styles.samples} id={styles.samples}>
          {/* Lista de amostras */}
          {samples.map((sample) => (
            <ul key={sample._id} className={styles.listSamples}>
              <div className={styles.sampleImg}>
                <img
                  src={sample.imagem_original || "/images/leaf_default.png"}
                  alt="Amostra de folha"
                />
              </div>
              <div className={styles.sampleInfo}>
                <h3>{sample.codigo_amostra}</h3>
                <li>Espécie: {sample.especie}</li>
                <li>Variedade: {sample.variedade}</li>
                <li>Local: {sample.localizacao?.municipio}, {sample.localizacao?.estado}</li>
                <li>Data da coleta: {new Date(sample.data_coleta).toLocaleDateString("pt-BR")}</li>
                <li>Nível de infecção: {sample.analise?.grau_infeccao}</li>
                <li>Bactéria detectada: {sample.analise?.bacteria_detectada}</li>
                <li>Área afetada: {sample.analise?.porcentagem_area_afetada}%</li>
                <li>Confiabilidade do modelo: {sample.analise?.confiabilidade_modelo}%</li>
                <li>Data da análise: {new Date(sample.analise?.data_analise).toLocaleDateString("pt-BR")}</li>

                {/* Botão de deletar */}
                <button
                  className={styles.btnDel}
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Deseja mesmo excluir esta amostra?"
                    );
                    if (confirmed) deleteSample(sample._id);
                  }}
                >
                  Deletar
                </button>

                {/* Botão de editar */}
                <button
                  className={styles.btnEdit}
                  onClick={() => openEditModal(sample)}
                >
                  Editar
                </button>
              </div>
            </ul>
          ))}
        </div>
      </div>

      {/* Renderização condicional do modal de edição */}
      {selectedSample && (
        <EditContent sample={selectedSample} onClose={closeEditModal} />
      )}
    </div>
  );
};

export default HomeContent;
