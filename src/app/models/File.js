import { Model, Sequelize } from 'sequelize';

class File extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize: connection,
      }
    );
  }
}

export default File;
