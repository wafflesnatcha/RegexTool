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
	drop_files: true,
	show_invisibles: false,
	refresh_delay: 200
};
