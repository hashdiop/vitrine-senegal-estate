# Senegal Estates — site vitrine (React)

Refonte de senegalestates.com : React 19 + Vite + TypeScript, Tailwind CSS v4, Framer Motion.

## Lancer
    npm install
    npm run dev      # http://localhost:5173
    npm run build       # vérifie les données puis crée la version de production dans dist/
    npm run check:data  # vérifie seulement les fichiers JSON

## Où modifier le contenu : `src/data/json/`
| Fichier | Contenu |
|---|---|
| `contact.json` | téléphones, numéro WhatsApp (tous les boutons), e-mail, adresse, GPS, horaires, réseaux sociaux, chiffres clés |
| `terrains.json` | terrains : prix (FCFA, sans espaces), superficie (m²), statut, document, type, lots, photos, atouts, GPS |
| `projets.json` | projets réalisés / en cours |
| `contenus.json` | services, valeurs, étapes, témoignages, équipe, FAQ |

Valeurs autorisées :
- `statut` (terrain) : `Disponible`, `Réservé`, `Vendu`
- `document` : `Titre foncier`, `Bail`, `Délibération`
- `type` : `Résidentiel`, `Commercial`, `Agricole`
- `region` : `Dakar`, `Thiès` (à étendre dans `src/data/schemas.ts`)
- `featured: true` affiche le terrain sur la page d'accueil
- photos : URL complète ou chemin vers `public/` (ex. `/images/terrains/lot-3.jpg`)

Chaque fichier est contrôlé (`src/data/schemas.ts`) : une faute (statut mal écrit, prix entre guillemets,
virgule oubliée) bloque le build avec un message en français indiquant le fichier et la ligne fautive.

Les terrains, projets, témoignages et les photos Unsplash sont des **exemples à remplacer**.

## Pages
Accueil · Terrains (filtres, tri, favoris, carte) · Fiche terrain (galerie, simulateur, carte) ·
Services (+ FAQ) · Projets (galerie filtrable) · À propos · Contact (formulaire → WhatsApp / e-mail) ·
Mentions légales · 404
