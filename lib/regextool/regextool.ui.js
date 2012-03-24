/**
 * RegexTool.UI
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.UI = (function() {
	var sample, result;

	return {
		init: function() {
			sample = $('#section-sample');
			result = $('#section-result');

			this.refresh();

			// Autofocus support
			var autofocus_el = $('form input[autofocus], form textarea[autofocus]').first();
			if(autofocus_el) autofocus_el.focus();
						
			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 1000);
		},

		refresh: function() {
			$(result).css('top', sample.offset().top + sample.outerHeight() + 'px');
		}
	};
})();
