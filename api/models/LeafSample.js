import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  bacteria_detectada: {
    type: String,
    default: "Xanthomonas phaseoli",
  },
  grau_infeccao: String,             // Ex: "Leve", "Moderada", "Grave"
  porcentagem_area_afetada: Number,  // Ex: 32.5 (% da folha afetada)
  confiabilidade_modelo: Number,     // Ex: 95 (% de confiança da IA)
  data_analise: { type: Date, default: Date.now },
  imagem_segmentada: String,         // URL da imagem com áreas afetadas destacadas
});

const geoSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  municipio: String,
  estado: String,
});

const leafSampleSchema = new mongoose.Schema({
  codigo_amostra: String,            // Identificador único da amostra
  especie: { type: String, default: "Manihot esculenta" },
  variedade: String,                 // Ex: "IAC 90"
  data_coleta: Date,
  coletado_por: String,
  imagem_original: String,           // Caminho/URL da imagem enviada
  localizacao: geoSchema,            // Dados geográficos da coleta
  analise: analysisSchema,           // Resultados da classificação IA
});

const LeafSample = mongoose.model("LeafSample", leafSampleSchema);

export default LeafSample;
