const {env} = require('process');

const config = {
  DATA_STORE: env.DATA_STORE,
  USERS_STORE: env.USERS_STORE,
  SAMPLE_TODO: env.SAMPLE_TODO
};

module.exports = config;
