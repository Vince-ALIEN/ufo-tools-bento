<?php
/**
 * Désinstallation : le plugin ne stocke que le cache de la dernière release
 * GitHub. Les contenus qui utilisent le bloc ne sont pas touchés.
 *
 * @package UfoToolsBento
 */

if (!defined("WP_UNINSTALL_PLUGIN")) {
    exit();
}

delete_site_transient('ufo_tools_bento_github_release');
