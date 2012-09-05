/*jshint browser:true, jquery:true*/
/*global log, RegexTool, XRegExp*/
RegexTool.Pattern = (function () {
	return {
		getExp: function () {
			try {
				var regex = XRegExp.cache(RegexTool.Storage.get('pattern'), this.getFlags());
				$('#pattern').removeClass('invalid');
				return regex;
			} catch (e) {
				$('#pattern').addClass('invalid');
				return false;
			}
		},

		getFlags: function () {
			var i, o = [],
				flags = ['g', 'i', 'm', 's', 'x'],
				l = flags.length;
			for (i = 0; i < l; i++) {
				if (RegexTool.Storage.get('flag-' + flags[i]) == "1") {
					o.push(flags[i]);
				}
			}
			return o.join('');
		}
	};
}());
