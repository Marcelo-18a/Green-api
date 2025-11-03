import leafSampleService from "../services/leafService.js";
import { ObjectId } from "mongodb";

// 🔹 Listar todas as amostras
const getAllSamples = async (req, res) => {
  try {
    const samples = await leafSampleService.getAll();
    res.status(200).json({ samples });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔹 Cadastrar uma nova amostra (gera análise aleatória)
const createSample = async (req, res) => {
  try {
    const {
      codigo_amostra,
      especie,
      variedade,
      data_coleta,
      coletado_por,
      imagem_original,
      localizacao,
    } = req.body;

    // 🔹 Simula a IA gerando análise automaticamente
    const analiseGerada = {
      bacteria_detectada: "Xanthomonas phaseoli",
      grau_infeccao: ["Leve", "Moderada", "Grave"][Math.floor(Math.random() * 3)],
      porcentagem_area_afetada: Number((Math.random() * 100).toFixed(1)),
      confiabilidade_modelo: Number((80 + Math.random() * 20).toFixed(1)), // 80–100%
      imagem_segmentada: `https://exemplo.com/imagens/segmentada_${Date.now()}.jpg`,
      data_analise: new Date(),
    };

    // 🔹 Cria a amostra com a análise gerada
    await leafSampleService.Create(
      codigo_amostra,
      especie,
      variedade,
      data_coleta,
      coletado_por,
      imagem_original,
      localizacao,
      analiseGerada
    );

    res.sendStatus(201); // CREATED
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔹 Deletar uma amostra
const deleteSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      await leafSampleService.Delete(id);
      res.sendStatus(204); // NO CONTENT
    } else {
      res.sendStatus(400); // BAD REQUEST
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔹 Atualizar uma amostra existente
const updateSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const {
        codigo_amostra,
        especie,
        variedade,
        data_coleta,
        coletado_por,
        imagem_original,
        localizacao,
        analise,
      } = req.body;

      const sample = await leafSampleService.Update(
        id,
        codigo_amostra,
        especie,
        variedade,
        data_coleta,
        coletado_por,
        imagem_original,
        localizacao,
        analise
      );

      res.status(200).json({ sample });
    } else {
      res.sendStatus(400); // BAD REQUEST
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔹 Buscar uma única amostra
const getOneSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const sample = await leafSampleService.getOne(id);

      if (!sample) {
        res.sendStatus(404); // NOT FOUND
      } else {
        res.status(200).json({ sample });
      }
    } else {
      res.sendStatus(400); // BAD REQUEST
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // INTERNAL SERVER ERROR
  }
};

export default {
  getAllSamples,
  createSample,
  deleteSample,
  updateSample,
  getOneSample,
};
