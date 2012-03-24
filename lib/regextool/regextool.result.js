/**
 * RegexTool.Result
 */

RegexTool.Result = (function() {
	var listEl, counter = 0,
		template = {
			match: [
				'<li class="match">',
				    '<a class="match-toggle"></a>',
				    '<p class="match-result">',
				        '<span class="match-character-index"><%character_index%></span>',
				        '<span class="match-string"><%string%></span>',
				    '</p>',
				'</li>'
				].join("\n"),

			submatch: [
				'<li class="submatch">',
				    '<p class="submatch-result">',
				        '<span class="submatch-string"><%string%></span>',
				    '</p>',
				'</li>'
				].join("\n")
		};


	return {
		clear: function() {
			listEl = $('<ol class="matches" />').appendTo($('#result-list').empty());
			counter = 0;
		},

		add: function(result) {
			if (!listEl) return false;
			counter++;

			var html = this.template(template.match, {
				character_index: result.index,
				string: result[0] != '' ? this.sanitize(result[0]) : '<span class="empty">empty</span>'
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
					string: result[i] != '' ? this.sanitize(result[i]) : '<span class="empty">empty</span>'
				})).appendTo($(sublist));
			}
		},

		template: function(template, data) {
			var prop, result = template;
			for (prop in data) {
				result = result.replace('<%' + prop + '%>', data[prop])
			}
			result = result.replace(/<%[a-z_\-0-9]%>/ig, '')
			return result;
		},

		sanitize: function(text) {
			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			if (RegexTool.config('show_invisibles')) {
				text = text.replace(/([\n\r\t])/g, '<span class="invisible">$1</span>');
			}
			return text;
		}
	};
})();
