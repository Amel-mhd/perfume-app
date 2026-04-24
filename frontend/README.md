# 🌸 Aura — Maison de Parfums

> Boutique de parfums haut de gamme — Fullstack React & Node.js

![Aura](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat&logo=netlify)

---

## ✨ Aperçu

**Aura** est une boutique de parfums haut de gamme développée en fullstack. Elle propose un catalogue de 74 fragrances issues des plus grandes maisons mondiales (Chanel, Dior, Hermès, YSL, Guerlain...), avec un quiz olfactif personnalisé, un système de favoris, un panier et des avis clients.

🔗 **[Voir le site en ligne](https://perfume-amel-app.netlify.app)**

---

## 🚀 Fonctionnalités

### Catalogue
- 74 parfums avec images, notes olfactives et accords
- Recherche en temps réel
- Filtres par marque, genre, accord olfactif et prix
- Tri par prix croissant/décroissant et par note
- Pagination (12 parfums par page)
- Skeleton loader pendant le chargement

### Parfum
- Page détail avec pyramide olfactive
- Parfums similaires
- Avis et notes clients (★)
- Bouton "Acheter en ligne"

### Quiz olfactif
- 4 questions pour trouver votre parfum idéal
- Algorithme de scoring par accords olfactifs
- 6 recommandations personnalisées

### Authentification
- Inscription avec email de confirmation (Gmail)
- Connexion avec JWT
- Page profil (infos, changement de mot de passe, suppression de compte)

### Favoris & Panier
- Ajout/suppression de favoris (localStorage)
- Panier avec quantités et total
- Notifications toast

---

## 🛠️ Stack Technique

### Frontend
| Tech | Usage |
|------|-------|
| React 18 | Interface utilisateur |
| React Router | Navigation |
| Axios | Requêtes API |
| Context API | État global (Auth, Cart) |
| CSS vanilla | Styles (glassmorphism, animations) |

### Backend
| Tech | Usage |
|------|-------|
| Node.js | Serveur |
| Express | Framework API REST |
| MongoDB + Mongoose | Base de données |
| JWT | Authentification |
| Bcrypt | Chiffrement des mots de passe |
| Nodemailer | Emails de confirmation |

### Déploiement
| Service | Usage |
|---------|-------|
| Netlify | Frontend |
| Render | Backend |
| MongoDB Atlas | Base de données cloud |

---

## 📁 Structure du projet

```
perfume-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── user.js
│   │   ├── products.js
│   │   └── reviews.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── data.json
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── ProductCard.js
        │   └── Toast.js
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        └── pages/
            ├── Home.js
            ├── Catalogue.js
            ├── ProductDetail.js
            ├── Quiz.js
            ├── Favorites.js
            ├── Cart.js
            ├── Profile.js
            ├── Login.js
            ├── Register.js
            └── NotFound.js
```

---

## ⚙️ Installation locale

### Prérequis
- Node.js 18+
- MongoDB local ou Atlas
- Compte Gmail avec App Password

### Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` :

```env
MONGODB_URI=mongodb://localhost:27017/perfume
JWT_SECRET=votre_secret
EMAIL_USER=votre@gmail.com
EMAIL_PASS=votre_app_password
PORT=3001
```

```bash
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🎨 Design

- **Palette** : Or `#D4AF6A` / Blanc cassé `#FDFAF5` / Noir `#1a1a1a`
- **Typographies** : Playfair Display (logo), Cormorant Garamond (titres), Montserrat (texte)
- **Style** : Glassmorphism, orbes animées, shimmer effect
- **Animations** : CSS transitions, float animations

---

## 👩‍💻 Développé par

**Amel Mehdaoui** — Développeuse Fullstack  
🔗 [Portfolio](https://amel-mhd.github.io/portfolio) · [GitHub](https://github.com/Amel-mhd) · [LinkedIn](https://linkedin.com/in/amel-mehdaoui)
