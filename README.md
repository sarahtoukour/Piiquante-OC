# PROJET 6 - Construisez une API sécurisée pour une application d'avis gastronomiques

## Instalation

### Back end

- Cloner le projet :

```text
git clone https://github.com/sismitrii/OC_P6_Hot_Takes.git backend
```

- Installer les dépendances du projet :

```text
    npm install
```

#### Connection à la base de donnée

L'API fonctionne avec une base de donnée MongoDB. Un compte MongoDB est donc requis. Si vous ne disposez pas de compte vous pouvez vous inscrire gratuitement à cette [https://www.mongodb.com/atlas/database](adresse).

- Créer un nouveau projet
- Built a database
  - Choisir Shared Free
  - Vous pouvez changer le ClusterName
  - Create Cluster
  - Définir un username et password
  - Add My current IP Address
  - Save
  - Sur l'onglet Database cliquer sur Connect > Connect your application
  - copier le lien commençant par "mongodb+srv://..."

Dans le dossier backend vous trouver un fichier `.env.sample``

- Duppliquer ce fichier
- Renommer le fichier `.env``
- Ouvrir le fichier et remplir :

  - MONGODB_CONNECT avec le lien copié
  - JWT_PASSWORD avec le mot de passe que vous voulez

- Executez :

```text
npm start
```

### Front-end

- Cloner le projet dans le même fichier que le back-end

```text
git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git frontend
```

- Installer les dépendences :

```text
npm install
```

- Executez :

```text
ng serve
```
