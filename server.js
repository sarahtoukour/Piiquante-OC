// récupération du package http de node
const http = require('http');

// récupération de l'application express
const app = require('./app');

// normalisation du port, gestion des erreurs et du logging au serveur Node
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// fonction qui renvoie un port valide ou le port 3000 recommandé
const port = normalizePort(process.env.PORT || '3000');

// assignation du port à l'application express
app.set('port', port);

// fonction qui recherche les erreurs et les gère
const errorHandler = (error) => {
  if (error.syscaa !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// création du serveur (on passe l'appli express à notre serveur)
const server = http.createServer(app);

server.on('error', errorHandler);

// écouteur d'évènements enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  console.log('Listening on' + bind);
});

// configuration du serveur sur le port (3000 par défaut)
server.listen(port);
