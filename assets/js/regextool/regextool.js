/*!
 * RegexTool
 * http://github.com/wafflesnatcha/RegexTool
 *
 * Author Scott Buchanan <buchanan.sc@gmail.com>
 * Copyright (c) 2012 Scott Buchanan
 * Dual licensed under the MIT and GPL licenses.
 */

/*global XRegExp*/
var RegexTool = (function () {
	var _refresh_timeout, config = {
		version: 'r1',
		storage_prefix: 'RegexTool.',
		example: {
			'pattern': '([a-zA-Z]{4,})',
			'sample': 'The quick brown fox jumps over the lazy dog.',
			'flag-g': true
		},
		show_invisibles: false,
		refresh_delay: 200,
		ui_refresh: false,
		ui_refresh_delay: 100
	};

	return {
		init: function () {
			RegexTool.UI.init();
			this.restore();
			this.save();

			$('#pattern, #sample').on('keyup change', this.changeHandler);
			$('#flags input[type="checkbox"]').on('change', this.changeHandler);
			$('#flags label').on('click', function (event) {
				if (event.which && event.which != 1) {
					return;
				}
				event.preventDefault();
				$('#' + $(this).prop("for")).trigger('click');
			});

			this.refresh();
		},

		getFormElements: function () {
			return $().add($("form#regextool").prop('elements'));
		},

		restore: function () {
			var version = RegexTool.Storage.get('version');
			if (version === undefined || version != RegexTool.config('version') || window.location.hash === "#CLEAR") {
				RegexTool.Storage.clear();
				RegexTool.Storage.set('version', RegexTool.config('version'));
				RegexTool.Storage.set(RegexTool.config('example'));
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

		config: function (property, value) {
			if (property) {
				if (arguments.length > 1) {
					config[property] = value;
				}
				return config[property];
			}
			return config;
		},

		changeHandler: function (e) {
			if ($(this).val() != RegexTool.Storage.get(this)) {
				RegexTool.Storage.saveElement(this);
				RegexTool.triggerRefresh();
				RegexTool.makeRegex();
			}
		},

		triggerRefresh: function () {
			if (_refresh_timeout) {
				clearTimeout(_refresh_timeout);
			}
			_refresh_timeout = setTimeout(function () {
				RegexTool.refresh.call(RegexTool);
			}, RegexTool.config('refresh_delay'));
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
				flags = ['g', 'i', 'm', 's', 'x'];
			for (i = 0; i < flags.length; i++) {
				if (RegexTool.Storage.get('flag-' + flags[i]) == "1") {
					o.push(flags[i]);
				}
			}
			return o.join('');
		}
	};
}());