import leafSampleService from "../services/leafService.js";
import { ObjectId } from "mongodb";

// 🔹 Listar todas as amostras (apenas do usuário logado)
const getAllSamples = async (req, res) => {
  try {
    const userId = req.loggedUser.id;
    const samples = await leafSampleService.getAllByUser(userId);
    res.status(200).json({ samples });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔹 Cadastrar uma nova amostra (gera análise aleatória)
const createSample = async (req, res) => {
  try {
    const userId = req.loggedUser.id;
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
      grau_infeccao: ["Leve", "Moderada", "Grave"][
        Math.floor(Math.random() * 3)
      ],
      porcentagem_area_afetada: Number((Math.random() * 100).toFixed(1)),
      confiabilidade_modelo: Number((80 + Math.random() * 20).toFixed(1)), // 80–100%
      imagem_segmentada: `https://exemplo.com/imagens/segmentada_${Date.now()}.jpg`,
      data_analise: new Date(),
    };

    // 🔹 Cria a amostra com a análise gerada e associa ao usuário
    await leafSampleService.Create(
      userId,
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

// 🔹 Deletar uma amostra (apenas se pertencer ao usuário)
const deleteSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const userId = req.loggedUser.id;

      // Verifica se a amostra pertence ao usuário antes de deletar
      const sample = await leafSampleService.getOneByUserAndId(userId, id);
      if (!sample) {
        return res
          .status(404)
          .json({
            error:
              "Amostra não encontrada ou você não tem permissão para acessá-la.",
          });
      }

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

// 🔹 Atualizar uma amostra existente (apenas se pertencer ao usuário)
const updateSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const userId = req.loggedUser.id;
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

      // Verifica se a amostra pertence ao usuário antes de atualizar
      const existingSample = await leafSampleService.getOneByUserAndId(
        userId,
        id
      );
      if (!existingSample) {
        return res
          .status(404)
          .json({
            error:
              "Amostra não encontrada ou você não tem permissão para acessá-la.",
          });
      }

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

// 🔹 Buscar uma única amostra (apenas se pertencer ao usuário)
const getOneSample = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const userId = req.loggedUser.id;
      const sample = await leafSampleService.getOneByUserAndId(userId, id);

      if (!sample) {
        res
          .status(404)
          .json({
            error:
              "Amostra não encontrada ou você não tem permissão para acessá-la.",
          });
      } else {
        res.status(200).json({ sample });
      }
    } else {
      res.sendStatus(400); // BAD REQUEST
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." }); // INTERNAL SERVER ERROR
  }
};

export default {
  getAllSamples,
  createSample,
  deleteSample,
  updateSample,
  getOneSample,
};
