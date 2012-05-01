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
		// character tabulation
		'0009': "&#x21E5;",
		// line feed (lf)
		'000a': "&not;",
		// carriage return (cr)
		'000d': "&crarr;"
	};

	var templates = {
		'invisible': '<span class="invisible invisible-code-<%code%>"><%substitute%><%char%></span>',
		'empty': '<span class="empty">empty</span>',
		'unset': '<span class="unset">undefined</span>',

		'match': [
			'<li class="match">',
			    '<a class="match-toggle"></a>',
			    '<p class="match-result">',
			        '<span class="match-character-index"><%character_index%></span>',
			        '<span class="match-string"><%string%></span>',
			    '</p>',
			'</li>'
			].join(''),

		'submatch': [
			'<li class="submatch">',
			    '<p class="submatch-result">',
			        '<span class="submatch-string"><%string%></span>',
			    '</p>',
			'</li>'
			].join('')
	};

	var listEl, invisibles, counter = 0;

	return {
		clear: function() {
			listEl = $('<ol class="matches" />').appendTo($('#result-list').empty());
			counter = 0;
		},

		add: function(result) {
			if (!listEl) this.clear();
			counter++;

			var html = this.template(templates.match, {
				'character_index': result.index,
				'string': RegexTool.Result.sanitize(result[0])
			});
			var parent = $(html).appendTo(listEl);

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
				$(this.template(templates.submatch, {
					'string': this.sanitize(result[i])
				})).appendTo($(sublist));
			}
		},

		template: function(template, data) {
			var prop, result = template,
				data = data || {};
			for (prop in data) {
				result = result.replace('<%' + prop + '%>', data[prop])
			}
			result = result.replace(/<%[a-z_\-0-9]+%>/ig, '')
			return result;
		},

		sanitize: function(text) {
			// Value is empty, use templates.empty
			if (text == '') return this.template(templates.empty);

			// Value is undefined, use templates.unset
			if (typeof text === "undefined") return this.template(templates.unset);

			var text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			if (RegexTool.config('show_invisibles')) text = this.insertInvisibles(text);
			return text;
		},

		insertInvisibles: function(text) {
			var i, t = text,
				invis = this.getInvisibles(),
				l = invis.length;
			for (i = 0; i < l; i++) {
				t = t.replace(invis[i].expression, invis[i].template);
			}
			return t;
		},

		getInvisibles: function() {
			if (!invisibles) {
				invisibles = [];
				for (var prop in invisible_characters) {
					invisibles.push({
						'code': prop,
						'expression': new RegExp('(\\u' + prop + ')', "g"),
						// 'substitute': invisible_characters[prop],
						'template': this.template(templates.invisible, {
							'char': String.fromCharCode("0x" + prop),
							'code': prop,
							'substitute': invisible_characters[prop]
						})
					});
				}
			}
			return invisibles;
		}
	};
})();