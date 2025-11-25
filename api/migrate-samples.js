import LeafSample from "./models/LeafSample.js";
import mongoose from "mongoose";

// Script para migrar amostras existentes adicionando um userId padrão
// IMPORTANTE: Execute este script apenas UMA VEZ após a implementação

const migrateExistingSamples = async () => {
  try {
    console.log("🔧 Iniciando migração de amostras existentes...");

    // Conectar ao banco (substitua pela sua string de conexão)
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/green-api"
    );

    // Buscar todas as amostras que não têm userId
    const samplesWithoutUserId = await LeafSample.find({
      $or: [{ userId: { $exists: false } }, { userId: null }],
    });

    console.log(
      `📊 Encontradas ${samplesWithoutUserId.length} amostras sem userId`
    );

    if (samplesWithoutUserId.length === 0) {
      console.log(
        "✅ Todas as amostras já possuem userId. Migração desnecessária."
      );
      return;
    }

    // OPÇÃO 1: Deletar amostras órfãs (use esta linha se quiser remover)
    // await LeafSample.deleteMany({ $or: [{ userId: { $exists: false } }, { userId: null }] });
    // console.log(`🗑️ ${samplesWithoutUserId.length} amostras órfãs foram removidas.`);

    // OPÇÃO 2: Atribuir a um usuário administrador padrão (recomendado para preservar dados)
    // Substitua 'ADMIN_USER_ID' pelo ID de um usuário administrador real
    const adminUserId = "ADMIN_USER_ID"; // ⚠️ SUBSTITUA PELO ID REAL

    const result = await LeafSample.updateMany(
      {
        $or: [{ userId: { $exists: false } }, { userId: null }],
      },
      { $set: { userId: adminUserId } }
    );

    console.log(
      `✅ ${result.modifiedCount} amostras foram atribuídas ao usuário administrador.`
    );
    console.log("🎉 Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com o banco encerrada.");
  }
};

// Executar apenas se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateExistingSamples();
}
