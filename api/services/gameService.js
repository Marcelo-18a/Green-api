import Game from "../models/Games.js";

class gameService {
  // Game.find().then(games => {
  // //sucesso
  // }).catch(error => {
  // // falha
  // })

  // async / await
  // Função para listar os jogos
  async getAll() {
    try {
      const games = await Game.find();
      return games;
    } catch (error) {
      console.log(error);
    }
  }

  // Função para cadastrar jogos
  async Create(title, year, price, descriptions) {
    try {
      const newGame = new Game({
        // title : title
        title,
        year,
        price,
        descriptions,
      });
      // Método do mongoose para cadastrar .save()
      await newGame.save();
    } catch (error) {
      console.log(error);
    }
  }

  // Função para deletar jogos
  async Delete(id) {
    try {
      await Game.findByIdAndDelete(id);
      console.log(`Game com a id: ${id} foi excluído.`);
    } catch (error) {
      console.log(error);
    }
  }

  // Função para alterar jogos
  async Update(id, title, year, price, descriptions) {
    try {
      const updatedGame = await Game.findByIdAndUpdate(
        id,
        {
          title,
          year,
          price,
          descriptions,
        },
        { new: true }
      ); // Retorna o documento já atualizado
      console.log(`Dados do game com a id: ${id} alterados com sucesso.`);
      return updatedGame;
    } catch (error) {
      console.log(error);
    }
  }

  // Função para listar um único jogo
  async getOne(id) {
    try {
      const game = await Game.findOne({ _id: id });
      return game;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new gameService();
