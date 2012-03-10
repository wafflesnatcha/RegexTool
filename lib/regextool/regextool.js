/*!
 * RegexTool
 * http://github.com/wafflesnatcha/RegexTool
 *
 * Author Scott Buchanan <buchanan.sc@gmail.com>
 * Copyright (c) 2012 Scott Buchanan
 * http://www.gnu.org/licenses/gpl.html
 */

/**
 * RegexTool
 */

var RegexTool = (function() {
	var _refresh_timeout, config = {
		storage_prefix: "RegexTool."
	};

	return {
		init: function() {
			RegexTool.UI.init();
			this.restore();
			this.save();

			$('#pattern, #sample').on('keyup', this.changeHandler);
			$('#flags input[type="checkbox"]').on('change', this.changeHandler);
			$('#flags label').on('click', function(event) {
				event.preventDefault();
				$('#' + $(this).prop("for")).trigger('click');
			});

			this.refresh();
		},

		restore: function() {
			this.Storage.restoreElement(Array.prototype.slice.call($("form#regextool")[0].elements));
		},

		save: function() {
			this.Storage.saveElement(Array.prototype.slice.call($("form#regextool")[0].elements));
		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		changeHandler: function(e) {
			if ($(this).val() != RegexTool.Storage.get(this)) {
				RegexTool.Storage.saveElement(this);
				RegexTool.triggerRefresh();
				RegexTool.makeRegex();
			}
		},

		triggerRefresh: function() {
			if (_refresh_timeout) clearTimeout(_refresh_timeout);
			_refresh_timeout = setTimeout(function() {
				RegexTool.refresh.call(RegexTool);
			}, 200);
		},

		refresh: function() {
			var regex = this.makeRegex();
			console.log("regex", regex);
			if (!regex) return false;

			RegexTool.Result.clear();

			var sample = RegexTool.Storage.get('sample'),
				pattern = RegexTool.Storage.get('pattern');
			if (sample == "" || pattern == "") return;

			if (RegexTool.Storage.get('flag-g')) {
				XRegExp.iterate(sample, regex, function(match) {
					RegexTool.Result.add(match);
				});
			} else {
				var match = regex.exec(sample);
				if (match && match.length > 0 && match[0].length > 0) RegexTool.Result.add(match);
			}
		},

		makeRegex: function() {
			try {
				var regex = XRegExp.cache(RegexTool.Storage.get('pattern'), this.makeFlags());
				$('#pattern').removeClass('invalid');
				return regex;
			} catch (e) {
				$('#pattern').addClass('invalid');
				return false;
			}
		},

		makeFlags: function() {
			var i, o = [],
				flags = ['g', 'i', 'm', 's', 'x'];
			for (i = 0; i < flags.length; i++) {
				if (RegexTool.Storage.get('flag-' + flags[i]) == "1") o.push(flags[i])
			}
			return o.join('');
		}

	};
})();
