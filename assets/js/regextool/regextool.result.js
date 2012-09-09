/*jshint browser:true, jquery:true*/
/*global RegexTool, log*/
RegexTool.Result = (function () {
	var listEl, invisibles, template_cache = {}, counter = 0;

	function getInvisibles() {
		if (!invisibles) {
			invisibles = [];
			var prop, ic = RegexTool.Config.invisible_characters;
			for (prop in ic) {
				if (ic.hasOwnProperty(prop)) {
					invisibles.push([new RegExp('(\\u' + prop + ')', "g"), $('#template_match_string_invisible').tmpl({
						'char': String.fromCharCode("0x" + prop),
						'code': prop,
						'substitute': ic[prop]
					}).wrap('<p>').parent().html()]);
				}
			}
		}
		return invisibles;
	}

	return {
		clear: function () {
			listEl = $('<ol class="matches" />').appendTo($('#result').empty());
			counter = 0;
			this.updateInfo();
		},

		add: function (result) {
			if (!listEl) {
				this.clear();
			}
			counter++;
			var lines = result.input.substr(0, result.index).split('\n');
			var parent = $('#template_match').tmpl({
				'line': lines.length,
				'column': lines.pop().length,
				'offset': result.index,
				'length': result[0].length,
				'index': counter,
				'string': RegexTool.Result.sanitize(result[0])
			}).appendTo(listEl);

			this.updateInfo();
			if (result.length > 1) {
				// Result has submatches
				result.shift();
				$(parent).addClass('parent');
				var i, l = result.length,
					sublist = $('<ol class="submatches" />').appendTo($(parent));

				// Configure toggle button
				$('.toggle', parent).click(function () {
					// sublist.toggle();
					$(this).parent().toggleClass('hidden');
				});

				// Add submatches
				for (i = 0; i < l; i++) {
					$('#template_match_submatch').tmpl({
						'index': (i + 1),
						'string': this.sanitize(result[i])
					}).appendTo(sublist);
				}
			}
		},

		sanitize: function (text) {
			// Value is empty, use 'empty' template
			if (text === '') {
				if (!template_cache.empty) {
					template_cache.empty = $('#template_match_string_empty').tmpl().wrap('<p>').parent().html();
				}
				return template_cache.empty;
			}

			// Value is undefined, use 'unset' template
			if (typeof text === "undefined") {
				if (!template_cache.unset) {
					template_cache.unset = $('#template_match_string_unset').tmpl().wrap('<p>').parent().html();
				}
				return template_cache.unset;
			}

			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			if (RegexTool.Config.show_invisibles) {
				var i, invis = getInvisibles(),
					l = invis.length;
				for (i = 0; i < l; i++) {
					text = text.replace(invis[i][0], invis[i][1]);
				}
			}
			return text;
		},

		updateInfo: function () {
			$('#info-bar .total-matches .value').text(counter);
		}
	};
}());
