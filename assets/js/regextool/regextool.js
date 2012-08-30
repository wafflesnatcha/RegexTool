/*!
 * RegexTool
 * http://github.com/wafflesnatcha/RegexTool
 *
 * Author Scott Buchanan <buchanan.sc@gmail.com>
 * Copyright (c) 2012 Scott Buchanan
 * Dual licensed under the MIT and GPL licenses.
 */
/*jshint browser:true, jquery:true*/
/*global XRegExp, log*/
var RegexTool = (function () {
	var _refresh_timeout;

	return {
		init: function (conf) {
			if (typeof conf === "object") {
				var prop;
				for (prop in conf) {
					if (conf.hasOwnProperty(prop)) {
						RegexTool.Config[prop] = conf[prop];
					}
				}
			}

			RegexTool.UI.init();
			this.restore();
			this.save();
			RegexTool.UI.initInput();
			this.refresh();
		},

		getFormElements: function () {
			return $().add($("form#regextool").prop('elements'));
		},

		restore: function () {
			var version = RegexTool.Storage.get('version');
			if (version === undefined || version != RegexTool.Config.version || window.location.hash === "#CLEAR") {
				RegexTool.Storage.clear();
				RegexTool.Storage.set('version', RegexTool.Config.version);
				RegexTool.Storage.set(RegexTool.Config.example);
			}
			$(this.getFormElements()).each(function () {
				RegexTool.Storage.restoreElement(this);
			});
		},

		save: function () {
			$(this.getFormElements()).each(function () {
				RegexTool.Storage.saveElement(this);
			});
		},

		triggerRefresh: function () {
			if (_refresh_timeout) {
				clearTimeout(_refresh_timeout);
			}
			_refresh_timeout = setTimeout(function () {
				RegexTool.refresh.call(RegexTool);
			}, RegexTool.Config.refresh_delay);
		},

		refresh: function () {
			var regex = this.makeRegex();
			if (!regex) {
				return false;
			}

			RegexTool.Result.clear();
			var sample = RegexTool.Storage.get('sample'),
				pattern = RegexTool.Storage.get('pattern');
			if (!sample || !pattern) {
				return;
			}

			if (RegexTool.Storage.get('flag-g')) {
				XRegExp.iterate(sample, regex, function (match) {
					RegexTool.Result.add(match, sample);
				});
			} else {
				var match = regex.exec(sample);
				if (match && match.length > 0 && match[0].length > 0) {
					RegexTool.Result.add(match, sample);
				}
			}
		},

		makeRegex: function () {
			try {
				var regex = XRegExp.cache(RegexTool.Storage.get('pattern'), this.makeFlags());
				$('#pattern').removeClass('invalid');
				return regex;
			} catch (e) {
				$('#pattern').addClass('invalid');
				return false;
			}
		},

		makeFlags: function () {
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
