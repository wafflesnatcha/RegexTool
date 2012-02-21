RegexTool.Pattern = (function() {
	var regExpObj, pattern, flags;
	
	return {
		get: function() {
			pattern = this.getPattern();
			flags = this.getFlags();
			try {
				regExpObj = XRegExp.cache(pattern, flags);
			} catch (e) {
				return false;
			}
			return regExpObj;
		},

		getPattern: function() {
			pattern = $('#pattern').val();
			return pattern;
		},

		getFlags: function() {
			var flags = "";
			if (RegexTool.Storage.get('flag-global')) flags += 'g';
			if (RegexTool.Storage.get('flag-ignorecase')) flags += 'i';
			if (RegexTool.Storage.get('flag-multiline')) flags += 'm';
			return flags;
		}
	};
})();
