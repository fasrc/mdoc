( function( $ ) {
	// Responsive videos
	var $all_videos = $( '.entry-content' ).find( 'iframe[src*="player.vimeo.com"], iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], iframe[src*="dailymotion.com"],iframe[src*="kickstarter.com"][src*="video.html"], object, embed' ),
		$container = $( '.sticky-container' );

	$all_videos.not( 'object object' ).each( function() {
		var $video = $(this);

		if ( $video.parents( 'object' ).length )
			return;

		if ( ! $video.prop( 'id' ) )
			$video.attr( 'id', 'rvw' + Math.floor( Math.random() * 999999 ) );

		$video
			.wrap( '<div class="responsive-video-wrapper" style="padding-top: ' + ( $video.attr( 'height' ) / $video.attr( 'width' ) * 100 ) + '%" />' )
			.removeAttr( 'height' )
			.removeAttr( 'width' );
	} );

	// Footer height
	$(window)
		.resize( function() {
			footer_height();
		} )
		.load( function() {
			footer_height();
		} );

	function footer_height() {
		f_height = $( '#footer-content' ).outerHeight() + 1;
		$( '#footer' ).css( { height: f_height + 'px' } );
		$( '#page' ).css( { marginBottom: -f_height + 'px', paddingBottom: f_height + 'px' } );
	}

	$( 'a[href="#"]' ).click( function(e) {
		e.preventDefault();
	});

	// Shortcode
	if ( theme_js_vars['carousel'] )
		$( '.carousel' ).carousel();

	if ( theme_js_vars['tooltip'] )
		$( 'a[rel="tooltip"]' ).tooltip();

	if ( theme_js_vars['tabs'] ) {
		$( '.nav-tabs a' ).click( function(e) {
			e.preventDefault();
			$(this).tab( 'show' );
		} );
	}
} )( jQuery );