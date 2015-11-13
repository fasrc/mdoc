( function($){
	wp.customize( 'ward_pro_theme_options[extended_footer_columns]', function( value ) {
		value.bind( function( to ) {
			$( '.footer-widget' ).removeClass( 'c2 c3 c4 c6 c12' ).addClass( to );
		} );
	} );
} )(jQuery);