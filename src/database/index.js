import Sequelize from 'sequelize';
// importa as configurações de conexão com nosso banco
import databaseConfig from '../config/database';
import User from '../app/models/User';

const models = [User]; // criar um array com todos os models da minha aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão com a base de dados
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection)); // <<< passando la para o model sequelize minha conexao
  }
}

export default new Database();
