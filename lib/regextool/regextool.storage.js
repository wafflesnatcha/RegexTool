/**
 * RegexTool.Result
 */

RegexTool.Storage = (function() {
	var proxy = {},
		_proxy = "memory";

	proxy.memory = function() {
		var _data = {};

		function set(key, value) {
			if (typeof key === "string") {
				_data[key] = value;
				return true;
			}
			return false;
		}

		function get(key) {
			return key ? _data[key] : _data;
		}

		function remove(key) {
			return delete _data[key];
		}

		return {
			'set': set,
			'get': get,
			'remove': remove
		};
	}();

	proxy.localStorage = function() {
		function set(key, value) {
			if (typeof key === "string" && (typeof value === "string" || typeof value === "number")) {
				window.localStorage[key] = value + "";
				return true;
			}
			return false;
		}

		function get(key) {
			if (!key) {
				var data = {};
				for (var prop in window.localStorage) {
					data[prop] = window.localStorage[prop];
				}
				return data;
			}
			return key ? window.localStorage[key] : window.localStorage;
		}

		function remove(key) {
			return delete window.localStorage[key];
		}

		return {
			'set': set,
			'get': get,
			'remove': remove
		};
	}();

	proxy.cookie = function() {
		function set(key, value) {
			var ex_date = new Date();
			ex_date.setDate(ex_date.getDate() + 365);
			document.cookie = key + "=" + escape(value) + "; expires=" + ex_date.toUTCString();
		}

		function get(key) {
			var i, name, value, data = {},
				cookies = document.cookie.split(";"),
				cookies_L = cookies.length;
			for (i = 0; i < cookies_L; i++) {
				name = cookies[i].substr(0, cookies[i].indexOf("="));
				value = cookies[i].substr(cookies[i].indexOf("=") + 1);
				if (name == key) return unescape(value);
				data[name] = value;
			}
			return key ? undefined : data;
		}

		function remove(key) {
			return set(key, "");
		}

		return {
			'set': set,
			'get': get,
			'remove': remove
		};
	}();

	// Select the appropriate data proxy based on browser support
	try {
		proxy.localStorage.set("__test__", 1)
		if (proxy.localStorage.get("__test__") == 1) _proxy = "localStorage";
		proxy.localStorage.remove("__test__");
	} catch (e) {
		proxy.cookie.set("__test__", 1);
		if (proxy.cookie.get("__test__") == 1) _proxy = "cookie";
		proxy.cookie.remove("__test__");
	}

	console.info("RegexTool.Storage _proxy : " + _proxy);

	return {
		get: function(key) {
			if ($.type(key) === "object") {
				key = $(key).prop('name');
				if (!key || key === null || key === undefined) return undefined;
			}
			if (key) key = RegexTool.config('storage_prefix') + key;
			return proxy[_proxy].get(key);
		},

		set: function(key, value) {
			if (typeof key === "object" && typeof value === "undefined") {
				for (var prop in key) {
					if (key.hasOwnProperty(prop)) arguments.callee.call(this, prop, key[prop]);
				}
				return;
			}
			return proxy[_proxy].set(RegexTool.config('storage_prefix') + key, value);
		},

		remove: function(key) {
			return proxy[_proxy].remove(RegexTool.config('storage_prefix') + key);
		},

		restoreElement: function(el) {
			if (typeof el === 'string') el = '#' + el;
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
