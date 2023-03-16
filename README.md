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

L'API fonctionne avec une base de donnée MongoDB. Crééz un cluster avec les privilèges de lecture et d'écriture.
Les données concernant la connection à la BDD MongoDB sont présentes dans des variables d'environnement dont vous trouverez la liste dans le fichier .env.test (il vous suffit d'ajouter les votres et de renommer le fichier en ".env" pour faire fonctionner le programme)

#### Dossier images

Il faut créér un dossier images à la racine du backend pour l'enregistrement des images ajoutées par les utilisateurs

- Executez :

```text
nodemon server
```

### Front-end

- Cloner le projet dans le même fichier que le back-end

```text
git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
```

- Installer les dépendances :

```text
npm install
```

- Executez :

```text
npm run start
```
