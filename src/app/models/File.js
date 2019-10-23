import { Model, Sequelize } from 'sequelize';
import paths from '../../config/paths';

class File extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${paths.filePath}/files/${encodeURI(this.path)}`;
          },
        },
      },
      {
        sequelize: connection,
      }
    );
  }
}

export default File;
