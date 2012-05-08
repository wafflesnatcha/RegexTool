/**
 * RegexTool.UI
 */
RegexTool.UI = (function() {
	var sample, result, _resize_timeout, refresh_delay = 200;

	return {
		init: function() {
			sample = $('#section-sample');
			result = $('#section-result');

			this.refresh();

			// Autofocus support
			var autofocus_el = $('form input[autofocus], form textarea[autofocus]').first();
			if (autofocus_el) autofocus_el.focus();

			// Hide URL bar on iOS
			// setTimeout(function() {
			// 	window.scrollTo(0, 0);
			// }, 1000);
			if (RegexTool.config('ui_refresh')) $(window).on('resize', function() {
				if (_resize_timeout) clearTimeout(_resize_timeout);
				_resize_timeout = setTimeout(function() {
					RegexTool.UI.refresh();
				}, refresh_delay);
			});
		},

		refresh: function() {
			$(result).css('top', sample.offset().top + sample.outerHeight() + 'px');
		}
	};
})();