/**
 * RegexTool
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

var RegexTool = (function() {
	var _refresh_timeout, config = {
		storage_prefix: "RegexTool."
	};

	return {
		init: function() {
			this.restoreAll();
			$('#pattern, #sample').on('keyup', RegexTool.changeHandler);
			$('#flags input').on('click', RegexTool.changeHandler);
			$('#pattern').focus();
			this.refresh();
		},

		restoreAll: function() {
			RegexTool.Storage.restoreElement(Array.prototype.slice.call($("#regextool")[0].elements));
		},
		
		saveAll: function() {
			RegexTool.Storage.saveElement(Array.prototype.slice.call($("#regextool")[0].elements));
		},

		getConfig: function() {
			return config;
		},

		changeHandler: function(e) {
			if ($(this).val() != RegexTool.Storage.saved(this)) {
				// RegexTool.saveAll();
				RegexTool.Storage.saveElement(this);
				RegexTool.triggerRefresh();
			}
		},

		triggerRefresh: function() {
			if (_refresh_timeout) clearTimeout(_refresh_timeout);
			_refresh_timeout = setTimeout(function() {
				RegexTool.refresh.call(RegexTool);
			}, 200);
		},

		refresh: function() {
			var regex = RegexTool.Pattern.get();
			console.log("RegexTool.refresh() => regex : %o", regex); 
			if (!regex) {
				$('#pattern').addClass('invalid');
				return false;
			} else {
				$('#pattern').removeClass('invalid');
			}

			RegexTool.Result.clear();
			var sample = $('#sample').val();
			if (sample == "" || RegexTool.Pattern.getPattern() == "") return;

			if (RegexTool.Storage.get('flag-g')) {
				XRegExp.iterate(sample, regex, function(match) {
					RegexTool.Result.add(match);
				});
			} else {
				var match = regex.exec(sample);
				if (match && match.length > 0 && match[0].length > 0) RegexTool.Result.add(match);
			}
		}
	};
})();
