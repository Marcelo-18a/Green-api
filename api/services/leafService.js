import LeafSample from "../models/LeafSample.js";

class leafSampleService {
  // 🔹 Listar todas as amostras
  async getAll() {
    try {
      const samples = await LeafSample.find();
      return samples;
    } catch (error) {
      console.error("Erro ao listar amostras:", error);
    }
  }

  // 🔹 Cadastrar uma nova amostra
  async Create(
    codigo_amostra,
    especie,
    variedade,
    data_coleta,
    coletado_por,
    imagem_original,
    localizacao,
    analise
  ) {
    try {
      const newSample = new LeafSample({
        codigo_amostra,
        especie,
        variedade,
        data_coleta,
        coletado_por,
        imagem_original,
        localizacao,
        analise,
      });

      await newSample.save();
      console.log(`Amostra ${codigo_amostra} cadastrada com sucesso.`);
      return newSample;
    } catch (error) {
      console.error("Erro ao cadastrar amostra:", error);
    }
  }

  // 🔹 Deletar uma amostra
  async Delete(id) {
    try {
      await LeafSample.findByIdAndDelete(id);
      console.log(`Amostra com id ${id} foi excluída.`);
    } catch (error) {
      console.error("Erro ao deletar amostra:", error);
    }
  }

  // 🔹 Atualizar uma amostra existente
  async Update(
    id,
    codigo_amostra,
    especie,
    variedade,
    data_coleta,
    coletado_por,
    imagem_original,
    localizacao,
    analise
  ) {
    try {
      const updatedSample = await LeafSample.findByIdAndUpdate(
        id,
        {
          codigo_amostra,
          especie,
          variedade,
          data_coleta,
          coletado_por,
          imagem_original,
          localizacao,
          analise,
        },
        { new: true }
      );

      console.log(`Amostra com id ${id} atualizada com sucesso.`);
      return updatedSample;
    } catch (error) {
      console.error("Erro ao atualizar amostra:", error);
    }
  }

  // 🔹 Buscar uma amostra específica
  async getOne(id) {
    try {
      const sample = await LeafSample.findById(id);
      return sample;
    } catch (error) {
      console.error("Erro ao buscar amostra:", error);
    }
  }
}

export default new leafSampleService();
