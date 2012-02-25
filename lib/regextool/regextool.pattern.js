/**
 * RegexTool.Pattern
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.Pattern = (function() {
	return {
		get: function() {
			try {
				var regex = XRegExp.cache(this.getPattern(), this.getFlags());
				$('#pattern').removeClass('invalid');
				return regex;
			} catch (e) {
				$('#pattern').addClass('invalid');
				return false;
			}
		},

		getPattern: function() {
			return $('#pattern').val();
		},

		getFlags: function() {
			var i, o = [],
				flags = ['g', 'i', 'm', 's', 'x'];
			for (i = 0; i < flags.length; i++) {
				if (RegexTool.Storage.get('flag-' + flags[i])) o.push(flags[i])
			}
			console.log("flags:", o);
			return o.join('');
		}
	};
})();
