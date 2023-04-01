# OC PROJET 6 - Construisez une API sécurisée pour une application d'avis gastronomiques

## Installation

### Back end

- Cloner le projet :

```text
git clone https://github.com/sarahtoukour/Piiquante-OC
```

- Installer les dépendances du projet :

```text
    npm install
```

#### Connection à la base de donnée

L'API fonctionne avec une base de donnée MongoDB. Il faudra donc créer un cluster avec les privilèges de lecture et d'écriture
Les données concernant la connection sont présentes dans des variables d'environnement dont vous trouverez la liste dans le fichier .env.test
Ajoutez vos données de connexion et renommer le fichier en ".env"

- Exécutez :

```text
nodemon server
```

le serveur tourne sur le port 3000

### Front-end

- Cloner le projet dans le même fichier que le back-end

```text
git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
```

- Installer les dépendances :

```text
npm install
```

- Exécutez :

```text
npm run start
```

Rendez-vous sur `http://localhost:4200/`
