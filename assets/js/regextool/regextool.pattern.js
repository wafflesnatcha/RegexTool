/*jshint browser:true, jquery:true*/
/*global log, RegexTool, XRegExp*/
RegexTool.Pattern = (function () {
	var flags = ['g', 'm', 'i', 's', 'x'],
		parse_re = new RegExp('^\/(.*(?!\\\\).)\/([' + flags.join('') + ']*)');

	function getFlags() {
		var i, o = [];
		for (i = 0; i < flags.length; i++) {
			if (RegexTool.Storage.get('flag-' + flags[i])) {
				o.push(flags[i]);
			}
		}
		return o.join('');
	}

	return {
		fix: function (pattern) {
			// Attempt to parse a regular expression that was typed in as `/something/gmisx`
			var i, m = pattern.match(parse_re);
			if (m) {
				this.set(m[1]);
				for (i = 0; i < flags.length; i++) {
					this.setFlag(flags[i], (m[2].indexOf(flags[i]) >= 0));
				}
				return true;
			}
			return false;
		},

		set: function (pattern) {
			RegexTool.Storage.set('pattern', pattern);
			RegexTool.Storage.restoreElement('pattern');
		},

		setFlag: function (flag, on) {
			RegexTool.Storage.set('flag-' + flag, (on ? true : false));
			RegexTool.Storage.restoreElement('flag-' + flag);
		},

		getExp: function () {
			try {
				var regex = XRegExp.cache(RegexTool.Storage.get('pattern'), getFlags());
				$('#pattern').removeClass('invalid');
				return regex;
			} catch (e) {
				$('#pattern').addClass('invalid');
				return false;
			}
		}
	};
}());
