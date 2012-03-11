/**
 * RegexTool.UI
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.UI = (function() {
	return {
		init: function() {
			$(window).on("resize", $.proxy(this.resizeHandler, this));
			this.refresh();
			$('form input[autofocus], form textarea[autofocus]').first().focus();
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 1000);
		},

		resizeHandler: function() {
			// console.debug("RegexTool.UI.resizeHandler()", arguments);
			this.refresh();
		},

		refresh: function() {
			// console.debug("RegexTool.UI.refresh()", arguments);
		}
	};
})();
