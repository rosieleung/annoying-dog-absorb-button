<?php
/*
Plugin Name: Annoying Dog Absorb Button
Version:     1.0.0
Plugin URI:  https://rosieleung.com/
Description: Allows your site to be absorbed by a flock of annoying dogs.
Author:      Rosie Leung
Author URI:  mailto:rosie@rosieleung.com
License:     GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.txt
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'A_D_ABSORB_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'A_D_ABSORB_PATH', dirname( __FILE__ ) );
define( 'A_D_ABSORB_VERSION', '1.0.0' );

add_action( 'plugins_loaded', 'a_d_absorb_init_plugin' );

function a_d_absorb_init_plugin() {
	include_once( A_D_ABSORB_PATH . '/includes/enqueue.php' );
}