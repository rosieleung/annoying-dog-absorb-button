<?php
/*
Plugin Name: Annoying Dog Absorb Button
Version:     1.1
Plugin URI:  https://rosieleung.com/
Description: Allows your site to be absorbed by a flock of annoying dogs.
Author:      Rosie Leung
Author URI:  mailto:rosie@rosieleung.com
License:     GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.txt
*/

defined( 'ABSPATH' ) || exit;

function ada_enqueue_scripts() {
	ada_enqueue( 'annoying-dog', '/assets/a_d_absorb.css' );
	ada_enqueue( 'annoying-dog', '/assets/a_d_absorb.js' );
}

add_action( 'wp_enqueue_scripts', 'ada_enqueue_scripts' );


function ada_enqueue( $handle, $rel_path, $deps = array(), $in_footer = true ) {
	$source  = untrailingslashit( plugin_dir_url( __FILE__ ) ) . $rel_path;
	$version = filemtime( __DIR__ . $rel_path );
	$ext     = pathinfo( $rel_path, PATHINFO_EXTENSION );
	if ( $ext === "css" ) {
		wp_enqueue_style( $handle, $source, $deps, $version );
	} elseif ( $ext === "js" ) {
		wp_enqueue_script( $handle, $source, $deps, $version, $in_footer );
	}
}
