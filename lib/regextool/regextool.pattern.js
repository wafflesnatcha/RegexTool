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
				return XRegExp(this.getPattern(), this.getFlags());
			} catch (e) {
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
