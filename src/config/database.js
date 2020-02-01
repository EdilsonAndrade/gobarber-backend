require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  storage: './__tests__/database.sqllite',
  logging: !process.env.DB_DIALECT,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
