# Bérenger Hto - Portfolio Interactif

Un portfolio moderne, minimaliste et ultra-performant conçu sous forme de Bento Grid.

## Fonctionnalités

- **Bento Grid Layout** : Une disposition moderne, entièrement responsive et optimisée pour tous les types d'écrans (Mobile, Tablette, PC).
- **Theme Switcher Circulaire** : Passage dynamique entre le mode clair (Light) et sombre (Dark) utilisant l'API CSS View Transitions et un masque circulaire personnalisé.
- **Smooth Scroll** : Défilement fluide et naturel de la page géré par la bibliothèque Lenis.
- **Modal de Contact Interactive** :
  - Formulaire de contact accessible via le bouton "Me contacter".
  - Effet de brillance/reflet blanc-violet (`btn-shine`) au survol du bouton de soumission.
  - Animation ludique de l'icône de l'avion en papier qui s'envole au survol.
  - Soumission asynchrone sécurisée avec try/catch, désactivation des champs, affichage d'un spinner de chargement et bannière d'erreur discrète.
- **Barre de défilement personnalisée** : Scrollbar webkit sur mesure s'adaptant automatiquement au thème sélectionné.
- **Icônes Lucide** : Chargement ciblé et vectoriel des icônes pour des performances web maximales.

## Technologies utilisées

- **Core** : HTML5, TypeScript
- **Style** : Tailwind CSS v4 (configuration manuelle du mode sombre par classe)
- **Animations & Effets** : CSS View Transitions API, CSS Keyframes
- **Outils & Libs** : Vite (Bundler), Lenis (Smooth Scroll), Lucide Icons

## Structure du projet

- `index.html` : Structure HTML principale, métadonnées SEO et balisage de la modal.
- `src/main.ts` : Point d'entrée de l'application gérant l'initialisation des icônes, du défilement Lenis, de la transition circulaire du thème et des événements de la modal de contact.
- `src/styles.css` : Déclarations de thèmes Tailwind v4, styles de la scrollbar sur mesure et animations CSS (View Transitions, brillance, et vol de l'avion).
