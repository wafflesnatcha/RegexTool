RegexTool.Storage = (function() {
	
	return {
		get: function(key) {
			return $.Storage.get(RegexTool.getConfig().storage_prefix + key);
		},

		load: function() {
			return this.loadElement([
				'pattern',
				'sample',
				'flag-global',
				'flag-multiline',
				'flag-ignorecase'
				]);
		},

		save: function() {
			this.saveElement([
				'pattern',
				'sample',
				'flag-global',
				'flag-multiline',
				'flag-ignorecase'
				]);
		},

		loadElement: function(id) {
			if (typeof id === "object") {
				for (var i = 0; i < id.length; i++) {
					this.loadElement(id[i]);
				}
				return;
			}

			var key = RegexTool.getConfig().storage_prefix + id,
				value = $.Storage.get(key),
				el = $("#" + id);

			switch (el.attr("type")) {
			case "checkbox":
				el.attr('checked', value);
				break;
			default:
				el.val(value);
			}
			return value;
		},

		saveElement: function(id) {
			if (typeof id === "object") {
				for (var i = 0; i < id.length; i++) {
					this.saveElement(id[i]);
				}
				return;
			}

			var key = RegexTool.getConfig().storage_prefix + id,
				el = $("#" + id);

			switch (el.attr("type")) {
			case "checkbox":
				if (el.attr('checked')) $.Storage.set(key, '1');
				else $.Storage.remove(key);
				break;
			default:
				$.Storage.set(key, el.val());
			}
			return el;
		}
	};
})();
