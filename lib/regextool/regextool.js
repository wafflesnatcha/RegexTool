var RegexTool = (function() {
	var _process_timeout, config = {
		storage_prefix: "RegexTool."
	};

	return {
		init: function() {
			RegexTool.Storage.load();

			$('#pattern, #sample').bind('keydown', function(e) {
				if (_process_timeout) clearTimeout(_process_timeout);
				_process_timeout = setTimeout(function() {
					RegexTool.changeHandler.apply(this, [e]);
				}, 200);
				return true;
			});

			$('#flags input').click(RegexTool.changeHandler);

			$('#pattern').focus();
			this.process();
		},

		getConfig: function() {
			return config;
		},

		changeHandler: function(e) {
			console.log("changeHandler", arguments);
			var el = $("#" + e.target.id);
			if (el.attr("type") == "checkbox" || el.val() != RegexTool.Storage.get(e.target.id)) {
				RegexTool.Storage.save();
				RegexTool.process();
			}
		},

		process: function() {
			var regex = RegexTool.Pattern.get();
			if (!regex) {
				$('#pattern').addClass('invalid');
				return false;
			} else {
				$('#pattern').removeClass('invalid');
			}

			RegexTool.Result.clear();
			var sample = $('#sample').val();

			if (!RegexTool.Storage.get('flag-global')) {
				var match = regex.exec(sample);
				if (match && match.length > 0 && match[0].length > 0) RegexTool.Result.add(match);
			} else {
				XRegExp.iterate(sample, regex, function(match) {
					RegexTool.Result.add(match);
				});
			}
		}
	};
})();
