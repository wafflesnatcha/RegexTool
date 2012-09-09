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

			if(String(window.location.hash).toLowerCase() === "#clear") {
				window.location.hash = '';
				RegexTool.Storage.clear();
			}
				
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
			if (version === undefined || version != RegexTool.Config.version) {
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
			var exp = RegexTool.Pattern.getExp();
			if (!exp) {
				return false;
			}

			RegexTool.Result.clear();
			var sample = RegexTool.Storage.get('sample'),
				pattern = RegexTool.Storage.get('pattern');
			if (!sample || !pattern) {
				return;
			}

			if (RegexTool.Storage.get('flag-g')) {
				XRegExp.forEach(sample, exp, function (match) {
					RegexTool.Result.add(match, sample);
				});

			} else {
				var match = XRegExp.exec(sample, exp);
				if (match && match.length > 0 && match[0].length > 0) {
					RegexTool.Result.add(match, sample);
				}
			}

		}
	};
}());
