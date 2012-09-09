/*jshint browser:true, jquery:true*/
/*global RegexTool, log*/
RegexTool.Config = {
	version: null,
	storage_prefix: 'RegexTool.',
	example: {
		'pattern': '([a-zA-Z]{4,})',
		'sample': 'The quick brown fox jumps over the lazy dog.',
		'flag-g': true
	},
	allow_drop_files: true,
	refresh_delay: 200,
	show_invisibles: false,
	fix_pasted_pattern: false
};

// Invisible character references (just the basics)
RegexTool.Config.invisible_characters = {
	'0009': "&#x21E5;",
	'000a': "&not;",
	'000d': "&crarr;"
};

// Invisible character references (full complement)
/* RegexTool.Config.invisible_characters = {
	'0000': "&#x2400;", // null
	'0001': "&#x2401;", // start of heading
	'0002': "&#x2402;", // start of text
	'0003': "&#x2403;", // end of text
	'0004': "&#x2404;", // end of transmission
	'0005': "&#x2405;", // enquiry
	'0006': "&#x2406;", // acknowledge
	'0007': "&#x2407;", // bell
	'0008': "&#x2408;", // backspace
	'0009': "&#x2409;", // character tabulation
	'000a': "&#x240A;", // line feed (lf)
	'000b': "&#x240B;", // line tabulation (vertical tabulation)
	'000c': "&#x240C;", // form feed (ff)
	'000d': "&#x240D;", // carriage return (cr)
	'000e': "&#x240E;", // shift out
	'000f': "&#x240F;", // shift in
	'0010': "&#x2410;", // data link escape
	'0011': "&#x2411;", // device control one
	'0012': "&#x2412;", // device control two
	'0013': "&#x2413;", // device control three
	'0014': "&#x2414;", // device control four
	'0015': "&#x2415;", // negative acknowledge
	'0016': "&#x2416;", // synchronous idle
	'0017': "&#x2417;", // end of transmission block
	'0018': "&#x2418;", // cancel
	'0019': "&#x2419;", // end of medium
	'001a': "&#x241a;", // substitute
	'001b': "&#x241b;", // escape
	'001c': "&#x241c;", // information separator four
	'001d': "&#x241d;", // information separator three
	'001e': "&#x241e;", // information separator two
	'001f': "&#x241f;", // information separator one
	'0020': "&#x2420;", // space
	'0021': "&#x2421;"  // delete
}; */
