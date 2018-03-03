console.log('Keys loaded');

exports.databaseCreds = {
  host: process.env.HOST,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
};
