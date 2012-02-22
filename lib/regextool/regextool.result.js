RegexTool.Result = (function() {
	var listEl;

	return {
		clear: function() {
			$("#result").empty();
			listEl = $("<ol/>").appendTo($("#result"));
		},

		add: function(result) {
			if (!listEl) return false;
			// console.log(Array.prototype.slice.call(result));
			var parent = $("<li><span>" + result[0] + "</span></li>").appendTo($(listEl));

			if (result.length <= 1) return;
			result.shift();

			$(parent).addClass("parent");
			var item, sublist = $("<ol/>").appendTo($(parent));

			$("span", parent).click(function() {
				$(this).next().toggle();
				$(this).parent().toggleClass("hidden");
			});
			
			for(var i=0; i<result.length; i++) {
				$("<li>" + result[i] + "</li>").appendTo($(sublist));
			}
		}
	};
})();
