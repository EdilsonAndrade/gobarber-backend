import Sequelize from 'sequelize';
// importa as configurações de conexão com nosso banco
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment]; // criar um array com todos os models da minha aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    // cria a conexão com a base de dados
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(
        model =>
          model && model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
