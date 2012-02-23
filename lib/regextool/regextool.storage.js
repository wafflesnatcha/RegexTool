/**
 * RegexTool.Result
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.Storage = (function() {
	return {
		get: function(key) {
			return $.Storage.get(RegexTool.getConfig().storage_prefix + key);
		},

		set: function(key, value) {
			return $.Storage.set(RegexTool.getConfig().storage_prefix + key, value);
		},

		remove: function(key) {
			return $.Storage.remove(RegexTool.getConfig().storage_prefix + key);
		},

		saved: function(el) {
			return this.get($(el).attr('name'));
		},

		restoreElement: function(el) {
			if (typeof el === 'string') el = $('#' + el);
			else if (Object.prototype.toString.call(el) === '[object Array]') {
				var i, l = el.length;
				for (i = 0; i < l; i++) this.restoreElement(el[i]);
				return;
			}

			var el = $(el),
				value = this.saved(el);

			switch (el.prop('tagName').toLowerCase()) {
			case 'input':
				switch (el.prop('type').toLowerCase()) {
				case 'checkbox':
					el.prop('checked', value ? true : false);
					break;
				default:
					el.val(value);
				}
				break;
			case 'textarea':
			default:
				el.val(value);
			}
			return value;
		},

		saveElement: function(el) {
			if (typeof el === 'string') el = $('#' + el);
			else if (toString.call(el) === '[object Array]') {
				var i, l = el.length;
				for (i = 0; i < l; i++) this.saveElement(el[i]);
				return;
			}

			var el = $(el),
				id = el.attr('name');

			switch (el.prop('tagName').toLowerCase()) {
			case 'input':
				switch (el.prop('type').toLowerCase()) {
				case "checkbox":
					if (el.prop('checked')) this.set(id, "1");
					else this.remove(id);
					break;
				default:
					this.set(id, el.val());
				}
				break;
			case 'textarea':
			default:
				this.set(id, el.val());
			}
		}
	};
})();
