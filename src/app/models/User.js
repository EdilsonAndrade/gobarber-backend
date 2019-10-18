import Sequelize, { Model } from 'sequelize';
import bcript from 'bcryptjs';

class User extends Model {
  static init(connection) {
    // no init contém todas as colunas e os tipos do meu model que serão mostrados ao usuário
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize: connection, // aqui pode utilizar varias propriedades, opções, trocar nome de tabelas...
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcript.hash(user.password, 8);
      }
    });
    this.addHook('beforeUpdate', async user => {
      if (user.password) {
        user.password_hash = await bcript.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcript.compare(password, this.password_hash);
  }
}

export default User;
