/**
 * RegexTool.UI
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.UI = (function() {
	var layouts = {
		"mobile": {
			width: 480,
			height: 480
		},
		"small": {
			width: 640,
			height: 480
		},
	};
	return {
		init: function() {
			$(window).on("resize", $.proxy(this.resizeHandler, this));
			this.assignLayout();
			this.refresh();
			$('form input[autofocus], form textarea[autofocus]').first().focus();
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 1000);
		},

		resizeHandler: function() {
			console.debug("RegexTool.UI.resizeHandler()", arguments);
			this.assignLayout();
			this.refresh();
		},

		refresh: function() {
			// console.debug("RegexTool.UI.refresh()", arguments);
		},

		assignLayout: function() {
			var r, i, w = $(window).width(),
				h = $(window).height();
			for (i in layouts) {
				r = layouts[i];
				if (w <= r.width && h <= r.height) {
					$(document.body).removeClass(function() {
						var m = $(this).prop('class').match(/\blayout\-[^\s]*/i);
						if (m && m.length > 0) return m.join(' ');
					})
					$(document.body).addClass("layout-" + i);
					break;
				}
			}
		}
	};
})();
