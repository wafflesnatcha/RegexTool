/*jshint browser:true, jquery:true*/
/*global RegexTool, log*/
RegexTool.Storage = (function () {
	var proxy = {}, _proxy = "memory";

	proxy.memory = (function () {
		var _data = {};
		return {
			set: function (key, value) {
				if (typeof key === "string") {
					_data[key] = value;
					return true;
				}
				return false;
			},

			get: function (key) {
				return key ? _data[key] : _data;
			},

			remove: function (key) {
				return delete _data[key];
			}
		};
	}());

	proxy.localStorage = (function () {
		return {
			set: function (key, value) {
				if ($.type(key) === "string" && ["string", "number"].indexOf($.type(value)) >= 0) {
					window.localStorage[key] = String(value);
					return true;
				}
				return false;
			},

			get: function (key) {
				if (!key) {
					var prop, data = {};
					for (prop in window.localStorage) {
						if (window.localStorage.hasOwnProperty(prop)) {
							data[prop] = window.localStorage[prop];
						}
					}
					return data;
				}
				return key ? window.localStorage[key] : window.localStorage;
			},

			remove: function (key) {
				return delete window.localStorage[key];
			}
		};
	}());

	proxy.cookie = (function () {
		var set = function (key, value) {
				var ex_date = new Date();
				ex_date.setDate(ex_date.getDate() + 365);
				document.cookie = key + "=" + window.escape(value) + "; expires=" + ex_date.toUTCString();
			};

		return {
			set: set,

			get: function (key) {
				var i, name, value, data = {}, cookies = document.cookie.split(";"),
					l = cookies.length;
				for (i = 0; i < l; i++) {
					name = cookies[i].substr(0, cookies[i].indexOf("="));
					value = cookies[i].substr(cookies[i].indexOf("=") + 1);
					if (name == key) {
						return window.unescape(value);
					}
					data[name] = value;
				}
				return key ? undefined : data;
			},

			remove: function (key) {
				return set(key, "");
			}
		};
	}());

	// Select the appropriate data proxy based on browser support
	var test_value = "RegexTool.__test__";
	try {
		proxy.localStorage.set(test_value, 1);
		if (proxy.localStorage.get(test_value) == 1) {
			_proxy = "localStorage";
		}
		proxy.localStorage.remove(test_value);
	} catch (e) {
		proxy.cookie.set(test_value, 1);
		if (proxy.cookie.get(test_value) == 1) {
			_proxy = "cookie";
		}
		proxy.cookie.remove(test_value);
	}

	return {
		get: function (key) {
			if ($.type(key) === "object") {
				key = $(key).prop('name');
				if (!key || key === null || key === undefined) {
					return undefined;
				}
			}
			if (key) {
				key = String(RegexTool.config('storage_prefix') + key);
				var value = proxy[_proxy].get(key);
				return value ? JSON.parse(value) : undefined;
			}
			return proxy[_proxy].get();
		},

		set: function (key, value) {
			if (typeof key === "object" && typeof value === "undefined") {
				var prop;
				for (prop in key) {
					if (key.hasOwnProperty(prop)) {
						RegexTool.Storage.set(prop, key[prop]);
					}
				}
				return;
			}
			return proxy[_proxy].set(RegexTool.config('storage_prefix') + key, JSON.stringify(value));
		},

		remove: function (key) {
			return proxy[_proxy].remove(RegexTool.config('storage_prefix') + key);
		},

		clear: function () {
			var prop, prefix = RegexTool.config('storage_prefix'),
				data = this.get();
			for (prop in data) {
				if (data.hasOwnProperty(prop) && prop.indexOf(prefix) === 0) {
					proxy[_proxy].remove(prop);
				}
			}
		},

		restoreElement: function (el) {
			if (typeof el === 'string') {
				el = '#' + el;
			}
			el = $(el);
			var value = this.get(el);

			if (el.prop('tagName').toLowerCase() == 'input') {
				switch (el.prop('type').toLowerCase()) {
				case 'checkbox':
				case 'radio':
					el.prop('checked', value);
					break;
				default:
					el.val(value);
				}
			} else {
				el.val(value);
			}
			return value;
		},

		saveElement: function (el) {
			if (typeof el === 'string') {
				el = $('#' + el);
			}
			el = $(el);
			var id = el.prop('name');

			if (el.prop('tagName').toLowerCase() == 'input') {
				switch (el.prop('type').toLowerCase()) {
				case 'checkbox':
				case 'radio':
					this.set(id, (el.prop('checked') || el.checked) ? true : false);
					break;
				default:
					this.set(id, el.val());
				}
			} else {
				this.set(id, el.val());
			}
		}
	};
}());