=== Ufo Tools Bento ===
Contributors: ufoagency
Tags: gutenberg, block, tailwind
Requires at least: 6.1
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Les derniers articles, pages ou réalisations dans une grille bento.

== Description ==

Bloc `ufo-blocks/ufo-bento` extrait du plugin Ufo Blocks (jusqu'à la version 1.8.0). Le nom du bloc et ses attributs sont inchangés : les contenus existants restent valides.

Rendu côté serveur ; grille prévue pour 2 éléments (une ligne) ou 5 (deux lignes), mise en page aussi correcte pour 1, 3 et 4. Filtrage par catégorie (`page_category`, `category`, `type_realisation`), couleur des cartes choisie dans la palette `theme.json` (contraste AA avec le texte blanc). Un thème peut fournir une image par défaut avec le filtre `ufo_bento_default_image_url`.

Le bloc apparaît dans la catégorie « UFO Blocks » de l'éditeur, que Ufo Blocks soit installé ou non.

= Tailwind CSS v4 =

Le plugin ne livre aucune CSS front. Il s'appuie sur un thème Tailwind CSS v4, qui doit scanner ses sources. Dans le fichier CSS d'entrée du thème :

`@source "../../../plugins/ufo-tools-bento/src/**/*.{js,php}";`

== Installation ==

1. Copier le dossier `ufo-tools-bento` dans `wp-content/plugins/`.
2. `npm install && npm run build` (ou installer le zip produit par `npm run plugin-zip`).
3. Activer **Ufo Tools Bento**.

== Changelog ==

= 1.0.0 =
* Bloc `ufo-bento` sorti d'Ufo Blocks 1.8.0 dans son propre plugin, sans changement de rendu.
