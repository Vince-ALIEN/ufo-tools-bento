<?php
/**
 * Plugin Name:       Ufo Tools Bento
 * Description:       Bloc Gutenberg UFO Bento : derniers articles, pages ou réalisations dans une grille bento (Tailwind CSS).
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            UFO Agency
 * Author URI:        https://ufo-agency.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ufo-tools-bento
 *
 * @package UfoToolsBento
 */

if (!defined("ABSPATH")) {
    exit();
}

// Le bloc garde son nom historique (ufo-blocks/ufo-bento) pour que les contenus
// existants restent valides. Ufo Blocks ≤ 1.8.0 l'enregistre encore : priorité
// 20 pour passer après lui et ne pas l'enregistrer deux fois.
function ufo_tools_bento_block_init()
{
    if (WP_Block_Type_Registry::get_instance()->is_registered("ufo-blocks/ufo-bento")) {
        return;
    }
    register_block_type(__DIR__ . "/build/ufo-bento");
}
add_action("init", "ufo_tools_bento_block_init", 20);

// Catégorie partagée avec Ufo Blocks et les autres Ufo Tools : ajoutée
// seulement si aucun d'eux ne l'a déjà fait.
function ufo_tools_bento_register_category($categories) {
    if (in_array('ufo-blocks', wp_list_pluck($categories, 'slug'), true)) {
        return $categories;
    }

    $categories[] = array(
        'slug'  => 'ufo-blocks',
        'title' => __('UFO Blocks', 'ufo-tools-bento'),
    );
    return $categories;
}
add_filter('block_categories_all', 'ufo_tools_bento_register_category', 20);
