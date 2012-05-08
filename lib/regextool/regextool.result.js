/**
 * RegexTool.Result
 */
RegexTool.Result = (function() {

	// Invisible character references (full complement)
	/*
	var invisible_characters = {
		'0000': "&#x2400;", 	// null
		'0001': "&#x2401;", 	// start of heading
		'0002': "&#x2402;", 	// start of text
		'0003': "&#x2403;", 	// end of text
		'0004': "&#x2404;", 	// end of transmission
		'0005': "&#x2405;", 	// enquiry
		'0006': "&#x2406;", 	// acknowledge
		'0007': "&#x2407;", 	// bell
		'0008': "&#x2408;", 	// backspace
		'0009': "&#x2409;", 	// character tabulation
		'000a': "&#x240A;", 	// line feed (lf)
		'000b': "&#x240B;", 	// line tabulation (vertical tabulation)
		'000c': "&#x240C;", 	// form feed (ff)
		'000d': "&#x240D;", 	// carriage return (cr)
		'000e': "&#x240E;", 	// shift out
		'000f': "&#x240F;", 	// shift in
		'0010': "&#x2410;", 	// data link escape
		'0011': "&#x2411;", 	// device control one
		'0012': "&#x2412;", 	// device control two
		'0013': "&#x2413;", 	// device control three
		'0014': "&#x2414;", 	// device control four
		'0015': "&#x2415;", 	// negative acknowledge
		'0016': "&#x2416;", 	// synchronous idle
		'0017': "&#x2417;", 	// end of transmission block
		'0018': "&#x2418;", 	// cancel
		'0019': "&#x2419;", 	// end of medium
		'001a': "&#x241a;", 	// substitute
		'001b': "&#x241b;", 	// escape
		'001c': "&#x241c;", 	// information separator four
		'001d': "&#x241d;", 	// information separator three
		'001e': "&#x241e;", 	// information separator two
		'001f': "&#x241f;", 	// information separator one
		'0020': "&#x2420;", 	// space
		'0021': "&#x2421;"  	// delete
	};
*/

	// Invisible character references (just the basics)
	var invisible_characters = {
		'0009': "&#x21E5;",
		'000a': "&not;",
		'000d': "&crarr;"
	};

	var listEl, invisibles, template_cache = {},
		counter = 0;

	function getInvisibles() {
		if (!invisibles) {
			invisibles = [];
			for (var prop in invisible_characters) {
				invisibles.push([new RegExp('(\\u' + prop + ')', "g"), $('#template_match-string-invisible').tmpl({
					'char': String.fromCharCode("0x" + prop),
					'code': prop,
					'substitute': invisible_characters[prop]
				}).wrap('<p>').parent().html()]);
			}
		}
		return invisibles;
	}

	return {
		clear: function() {
			listEl = $('<ol class="matches" />').appendTo($('#result-list').empty());
			counter = 0;
		},

		add: function(result) {
			if (!listEl) this.clear();
			counter++;

			var parent = $('#template_match').tmpl({
				'character_index': result.index,
				'index': counter,
				'string': RegexTool.Result.sanitize(result[0])
			}).appendTo(listEl);

			if (result.length <= 1) return;

			// Result has submatches
			result.shift();
			$(parent).addClass('parent');
			var item, i, l = result.length,
				sublist = $('<ol class="submatches" />').appendTo($(parent));

			// Configure toggle button
			$('.match-toggle', parent).click(function() {
				// sublist.toggle();
				$(this).parent().toggleClass('hidden');
			});

			// Add submatches
			for (i = 0; i < l; i++) {
				$('#template_match-submatch').tmpl({
					'index': (i + 1),
					'string': this.sanitize(result[i])
				}).appendTo(sublist)
			}
		},

		sanitize: function(text) {
			// Value is empty, use 'empty' template
			if (text == '') {
				if (!template_cache['empty']) template_cache['empty'] = $('#template_match-string-empty').tmpl().wrap('<p>').parent().html();
				return template_cache['empty'];
			}

			// Value is undefined, use 'unset' template
			if (typeof text === "undefined") {
				if (!template_cache['unset']) template_cache['unset'] = $('#template_match-string-unset').tmpl().wrap('<p>').parent().html();
				return template_cache['unset'];
			}

			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			if (RegexTool.config('show_invisibles')) {
				var i, invis = getInvisibles(),
					l = invis.length;
				for (i = 0; i < l; i++) {
					text = text.replace(invis[i][0], invis[i][1]);
				}
			}
			return text;
		},

		updateInfo: function() {
			$('#result-info').text(counter + ((counter == 1) ? "match" : "matches"));
		}
	};
})();