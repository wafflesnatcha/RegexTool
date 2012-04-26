/**
 * RegexTool.Result
 */

RegexTool.Result = (function() {

	// Invisible character references
	// Full complement
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

	// Just the basics
	var invisible_characters = {
		'0009': "&#x21E5;", 	// character tabulation
		// '000a': "&#x21B4;", 	// line feed (lf)
		'000a': "&not;", 		// line feed (lf)
		// '000d': "&crarr;",  	// carriage return (cr)
		'000d': "&#x21A9;"  	// carriage return (cr)
		// '0020': "&#x2423;"  	// space
	};

	var template = {
		match: [
			'<li class="match">',
			    '<a class="match-toggle"></a>',
			    '<p class="match-result">',
			        '<span class="match-character-index"><%character_index%></span>',
			        '<span class="match-string"><%string%></span>',
			    '</p>',
			'</li>'
			].join(''),

		submatch: [
			'<li class="submatch">',
			    '<p class="submatch-result">',
			        '<span class="submatch-string"><%string%></span>',
			    '</p>',
			'</li>'
			].join(''),

		invisible: '<span class="invisible invisible-code-<%code%>"><%substitute%></span>'
	};

	var listEl, invisibles, counter = 0;

	return {
		clear: function() {
			listEl = $('<ol class="matches" />').appendTo($('#result-list').empty());
			counter = 0;
		},

		add: function(result) {
			if (!listEl) return false;
			counter++;

			var html = this.template(template.match, {
				'character_index': result.index,
				'string': (result[0] != '') ? this.sanitize(result[0]) : '<span class="empty">empty</span>'
			});
			var parent = $(html).appendTo(listEl);

			if (result.length <= 1) return;
			result.shift();

			$(parent).addClass('parent');
			var item, i, l = result.length,
				sublist = $('<ol class="submatches" />').appendTo($(parent));

			$('.match-toggle', parent).click(function() {
				sublist.toggle();
				$(this).parent().toggleClass('hidden');
			});

			for (i = 0; i < l; i++) {
				$(this.template(template.submatch, {
					'string': (result[i] != '') ? this.sanitize(result[i]) : '<span class="empty">empty</span>'
				})).appendTo($(sublist));
			}
		},

		template: function(template, data) {
			var prop, result = template;
			for (prop in data) {
				result = result.replace('<%' + prop + '%>', data[prop])
			}
			result = result.replace(/<%[a-z_\-0-9]+%>/ig, '')
			return result;
		},

		sanitize: function(text) {
			var text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			if (RegexTool.config('show_invisibles')) text = this.insertInvisibles(text);
			return text;
		},

		insertInvisibles: function(text) {
			var i, t = text,
				invis = this.getInvisibles(),
				l = invis.length;
			for (i = 0; i < l; i++) {
				t = t.replace(invis[i].expression, invis[i].template + String.fromCharCode("0x" + invis[i].code));
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
						// 'expression': String.fromCharCode("0x" + prop),
						// 'substitute': invisible_characters[prop],
						'template': this.template(template.invisible, {
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