<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function a_d_absorb_enqueue_scripts() {
	wp_enqueue_style( 'a-d-absorb', A_D_ABSORB_URL . '/assets/a_d_absorb.css', array(), A_D_ABSORB_VERSION );
	wp_enqueue_script( 'a-d-absorb', A_D_ABSORB_URL . '/assets/a_d_absorb.js', array( 'jquery' ), A_D_ABSORB_VERSION );
}

add_action( 'wp_enqueue_scripts', 'a_d_absorb_enqueue_scripts' );
