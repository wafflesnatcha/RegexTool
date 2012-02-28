/**
 * RegexTool.Result
 *
 * @author    Scott Buchanan <buchanan.sc@gmail.com>
 * @copyright 2012 Scott Buchanan
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 */

RegexTool.Result = (function() {
	var listEl, counter = 0;

	return {
		clear: function() {
			$('#result').empty();
			listEl = $('<ol class="matches" />').appendTo($('#result'));
			counter = 0;
		},

		add: function(result) {
			if (!listEl) return false;
			counter++;
			
			var el = [
				'<li class="match">',
					'<a class="match-index">' + counter + '</a>',
					'<div class="match-result">',
						'<p class="match-result-match">',
							'<span class="match-string-index">(' + result.index + ')</span>',
							'<span class="match-string' + (result[i] == '' ? ' empty' : '') + '">'  + result[0] + '</span>',
						'</p>',
					'</div>',
				'</li>'
				].join('');
			
			var parent = $(el).appendTo($(listEl));
			
			if (result.length <= 1) return;
			
			result.shift();

			$(parent).addClass('parent');
			var item, sublist = $('<ol class="submatches" />').appendTo($('.match-result', parent));
			
			$('.match-index', parent).click(function() {
				sublist.toggle();
				$(this).parent().toggleClass('hidden');
			});
			
			var i;
			for (i = 0; i < result.length; i++) {
				$('<li class="submatch"><span class="submatch-index">' + (i + 1) + '</span><span class="submatch-string' + (result[i] == '' ? ' empty' : '') + '">' + (result[i] != '' ? result[i] : 'empty') + '</span></li>').appendTo($(sublist));
			}
		}
	};
})();
