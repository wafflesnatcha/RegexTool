RegexTool.Result = (function() {
	var listEl;

	return {
		clear: function() {
			$("#result").empty();
			listEl = $("<ol/>").appendTo($("#result"));
		},

		add: function(result) {
			if (!listEl) return false;
			window.LAST_RESULT = Array.prototype.slice.call(result);
			console.log("RegexTool.Result.add", arguments);
			
			$("<li>" + result[0] + "</li>").appendTo($(listEl));
			result.shift();
			if(result.length < 1) return;
			var item, sublist = $("<ol/>").appendTo($(listEl));
			while (item = result.shift()) {
				$("<li>" + item + "</li>").appendTo($(sublist));
			}
		}
	};
})();
