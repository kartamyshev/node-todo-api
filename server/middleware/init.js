const bodyParser = require('body-parser');

const allowCORS = function(request, response, next) {
  response.header('Access-Control-Allow-Origin', 'http://localhost:8003');
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const initMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(allowCORS);
}

module.exports = { initMiddleware };
