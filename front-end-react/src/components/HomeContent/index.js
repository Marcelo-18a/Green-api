import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/components/HomeContent/HomeContent.module.css";
import Loading from "../Loading";
import EditContent from "../EditContent";
import Map from "../Map";
import Link from "next/link";
import { axiosConfig } from "@/utils/auth";
import { useNotification } from "../Notification/NotificationContext";
import ConfirmDialog from "../ConfirmDialog";

const HomeContent = () => {
  const [samples, setSamples] = useState([]); // Lista de amostras
  const [loading, setLoading] = useState(true);
  const [selectedSample, setSelectedSample] = useState(null); // Amostra selecionada para edição
  const { showSuccess, showError } = useNotification();

  // Estados para o dialog de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/leafsamples",
          axiosConfig
        );
        setSamples(response.data.samples);
      } catch (error) {
        console.error(error);
        showError("Erro ao carregar as amostras. Tente novamente.");
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
        `http://localhost:4000/leafsamples/${sampleId}`,
        axiosConfig
      );
      if (response.status === 204) {
        showSuccess("Amostra excluída com sucesso!");
        setSamples(samples.filter((sample) => sample._id !== sampleId));
      }
    } catch (error) {
      console.error(error);
      showError("Erro ao excluir a amostra. Tente novamente.");
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

  // Função para abrir o dialog de confirmação
  const openConfirmDialog = (sampleId) => {
    setConfirmDialog({
      isOpen: true,
      message:
        "Deseja mesmo excluir esta amostra? Esta ação não pode ser desfeita.",
      onConfirm: () => {
        deleteSample(sampleId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // Função para obter a classe CSS correta do nível de infecção
  const getInfectionLevelClass = (grauInfeccao) => {
    if (!grauInfeccao) return "";

    const normalized = grauInfeccao
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
      return styles.leve;
    }
    if (["moderado", "moderada", "medio", "media"].includes(normalized)) {
      return styles.moderado;
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
      return styles.grave;
    }

    return styles[normalized] || "";
  };

  // Função para fechar o dialog de confirmação
  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <div className={styles.homeContent}>
      {/* CARD MAPA RESUMO */}
      <div className={styles.mapSummaryCard}>
        <div className={styles.title}>
          <h2>Mapa de Distribuição das Amostras</h2>
          <Link href="/map" className={styles.viewFullMapLink}>
            Ver mapa completo →
          </Link>
        </div>
        <div className={styles.mapPreview}>
          <Map samples={samples.slice(0, 20)} /> {/* Limite para performance */}
        </div>
      </div>

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
            <div key={sample._id} className={styles.sampleCard}>
              <div className={styles.sampleImg}>
                <img
                  src={sample.imagem_original || "/images/leaf_default.png"}
                  alt="Amostra de folha"
                />
              </div>
              <div className={styles.sampleInfo}>
                <h3 className={styles.sampleCode}>{sample.codigo_amostra}</h3>

                {/* Informações principais destacadas */}
                <div className={styles.highlightInfo}>
                  <div className={styles.infectionLevel}>
                    <span className={styles.label}>Nível de Infecção</span>
                    <span
                      className={`${styles.badge} ${getInfectionLevelClass(
                        sample.analise?.grau_infeccao
                      )}`}
                    >
                      {sample.analise?.grau_infeccao}
                    </span>
                  </div>

                  <div className={styles.affectedArea}>
                    <span className={styles.label}>Área Afetada</span>
                    <span className={styles.percentage}>
                      {sample.analise?.porcentagem_area_afetada}%
                    </span>
                  </div>
                </div>

                {/* Informações secundárias */}
                <div className={styles.secondaryInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>📍</span>
                    <span>
                      {sample.localizacao?.municipio},{" "}
                      {sample.localizacao?.estado}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>📅</span>
                    <span>
                      {new Date(sample.data_coleta).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>🦠</span>
                    <span>{sample.analise?.bacteria_detectada}</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className={styles.actionButtons}>
                  <button
                    className={styles.btnEdit}
                    onClick={() => openEditModal(sample)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className={styles.btnDel}
                    onClick={() => openConfirmDialog(sample._id)}
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renderização condicional do modal de edição */}
      {selectedSample && (
        <EditContent sample={selectedSample} onClose={closeEditModal} />
      )}

      {/* Dialog de confirmação */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        type="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
};

export default HomeContent;
