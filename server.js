// On importe le module HTTP et notre application (qui est un module externe)
const http = require('http');
const app = require('./app');

// Cette fonction vérifie si le port est un nombre entier valide, et le renvoie si c'est le cas. Sinon, elle renvoie false.
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

// On essaie de récupérer le numéro de port à partir de la variable d'environnement PORT, ou on utilise le port 3000 par défaut. On enregistre ce numéro de port dans la configuration de l'application.
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Cette fonction est appelée en cas d'erreur lors de la création du serveur. Si l'erreur n'est pas liée à la méthode "listen", elle est renvoyée. Sinon on récupère l'adresse du serveur et on affiche un message d'erreur en fonction du code d'erreur.
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

// On crée un serveur HTTP à partir de notre application
const server = http.createServer(app);

// On écoute les événements d'erreur et de démarrage du serveur. En cas d'erreur, on appelle la fonction errorHandler. En cas de succès, on récupère l'adresse du serveur et on affiche un message de confirmation avec cette adresse.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
  console.log('Listening on' + bind);
});

// On lance le serveur en écoutant sur le port spécifié
server.listen(port);
