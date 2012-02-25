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
			$("#result").empty();
			listEl = $("<ol/>").appendTo($("#result"));
			counter = 0;
		},

		add: function(result) {
			if (!listEl) return false;
			console.dir(result);
			counter++;
			var parent = $('<li class="match"><span class="match-index">' + counter + '</span><div class="match-result"><span class="match-string"><span class="match-string-index">(' + result.index + ')</span>'  + result[0] + '</span></div></li>').appendTo($(listEl));
			
			if (result.length <= 1) return;
			
			result.shift();

			$(parent).addClass("parent");
			var item, sublist = $('<ol />').appendTo($(".match-result", parent));
			
			$(".match-index", parent).click(function() {
				sublist.toggle();
				$(this).parent().toggleClass("hidden");
			});

			for (var i = 0; i < result.length; i++) {
				$('<li class="submatch"><span class="submatch-index">' + (i + 1) + '</span><span class="submatch-string">' + result[i] + '</span></li>').appendTo($(sublist));
			}
		}
	};
})();
