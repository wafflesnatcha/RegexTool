/**
 * RegexTool.Result
 */

RegexTool.Storage = (function() {
	var proxy = {};

	proxy.memory = {
		_data: {},

		set: function(key, value) {
			var c;
			if (typeof key === "string") {
				proxy.memory._data[key] = value;
				return true;
			} else if (typeof key === "object" && typeof value === "undefined") {
				var c;
				for (c in key) {
					if (key.hasOwnProperty(c)) proxy.memory._data[c] = key[c];
				}
				return true;
			}
			return false;
		},

		get: function(key) {
			return key ? proxy.memory._data[key] : proxy.memory._data;
		},

		delete: function(key) {
			return delete proxy.memory._data[key];
		}
	};

	proxy.localStorage = {
		set: function(key, value) {
			if (typeof key === "string" && ( typeof value === "string" || typeof value === "number" )) {
				window.localStorage[key] = value + "";
				return true;
			} else if (typeof key === "object" && typeof value === "undefined") {
				var c;
				for (c in key) {
					if (key.hasOwnProperty(c)) window.localStorage[c] = key[c] + "";
				}
				return true;
			}
			return false;
		},

		get: function(key) {
			return key ? window.localStorage[key] : window.localStorage;
		},

		delete: function(key) {
			return delete window.localStorage[key];
		}
	};

	proxy.cookie = {
		set: function(key, value) {
			var dt, e, c;
			dt = new Date();
			dt.setTime(dt.getTime() + 31536000000);
			e = "; expires=" + dt.toGMTString();
			if (typeof key === "string" && typeof value === "string") {
				document.cookie = key + "=" + value + e + "; path=/";
				return true;
			} else if (typeof key === "object" && typeof value === "undefined") {
				for (c in key) {
					if (key.hasOwnProperty(c)) document.cookie = c + "=" + key[c] + e + "; path=/";
				}
				return true;
			}
			return false;
		},

		get: function(key) {
			var nn, ca, i, c;
			nn = key + "=";
			ca = document.cookie.split(';');
			for (i = 0; i < ca.length; i++) {
				c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nn) === 0) return c.substring(nn.length, c.length);
			}
			return null;
		},

		delete: function(key) {
			return proxy.cookie.set(key, "", -1);
		}
	};

	// Select the appropriate data proxy based on browser support
	var _proxy = proxy.memory;
	try {
		proxy.localStorage.set("__test__", 1)
		console.log(proxy.localStorage.get());
		if(proxy.localStorage.get("__test__") == 1)
			_proxy = proxy.localStorage;
		proxy.localStorage.delete("__test__");
	} catch(e) {
		console.error(e);
		proxy.cookie.set("__test__", 1);
		if(proxy.cookie.get("__test__") == 1)
			_proxy = proxy.cookie;
		proxy.cookie.delete("__test__");
	}

	return {
		_proxy: _proxy,

		get: function(key) {
			if ($.type(key) === "object") key = $(key).prop('name');
			if (!key) return;
			return this._proxy.get(RegexTool.config('storage_prefix') + key);
		},

		set: function(key, value) {
			return this._proxy.set(RegexTool.config('storage_prefix') + key, value);
		},

		delete: function(key) {
			return this._proxy.delete(RegexTool.config('storage_prefix') + key);
		},

		restoreElement: function(el) {
			if (typeof el === 'string') el = $('#' + el);
			else if (Object.prototype.toString.call(el) === '[object Array]') {
				var i, l = el.length;
				for (i = 0; i < l; i++) this.restoreElement(el[i]);
				return;
			}

			var el = $(el),
				value = this.get(el);

			switch (el.prop('tagName').toLowerCase()) {
			case 'input':
				switch (el.prop('type').toLowerCase()) {
				case 'checkbox':
					el.prop('checked', (value == "1") ? true : false);
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
				id = el.prop('name');

			switch (el.prop('tagName').toLowerCase()) {
			case 'input':
				switch (el.prop('type').toLowerCase()) {
					case 'checkbox':
					this.set(id, (el.prop('checked') || el.checked) ? "1" : "0");
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


RegexTool.Storage
