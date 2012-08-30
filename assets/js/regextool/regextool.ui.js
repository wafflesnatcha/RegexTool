/*jshint browser:true, jquery:true*/
/*global RegexTool, log*/
RegexTool.UI = (function () {
	var result, layout_input, _resize_timeout;

	function changeHandler(event) {
		// log("changeHandler(%o)", event);
		if ($(event.target).val() !== RegexTool.Storage.get(event.target)) {
			RegexTool.Storage.saveElement(event.target);
			RegexTool.triggerRefresh();
			RegexTool.makeRegex();
		}
	}

	function dropHandler(event) {
		log("dropHandler(%o)", event);
		var el = $(this);
		el.removeClass('dragover').focus();
		if (event.dataTransfer.files.length < 1) {
			setTimeout(function () {
				$(event.target).trigger('change');
			}, 1);
			return;
		}
		event.preventDefault();
		var reader = new FileReader();
		el.val('');
		reader.onload = function (event) {
			el.val(el.val() + event.target.result);
			el.trigger('change');
		};
		reader.readAsText(event.dataTransfer.files[0]);
	}

	function pasteHandler(event) {
		var el = this;
		event.stopPropagation();
		setTimeout(function () {
			log($(el).val(), event);
		}, 1);
	}

	return {
		init: function () {
			result = $('#section-result');
			layout_input = $('#regextool > .layout-input');

			this.refresh();

			// Autofocus support
			var autofocus_el = $('form input[autofocus], form textarea[autofocus]').first();
			if (autofocus_el) {
				autofocus_el.focus();
			}

			if (RegexTool.Config.ui_refresh) {
				$(window).on('resize', function () {
					if (_resize_timeout) {
						clearTimeout(_resize_timeout);
					}
					_resize_timeout = setTimeout(function () {
						RegexTool.UI.refresh();
					}, RegexTool.Config.ui_refresh_delay);
				});
			}
		},

		initInput: function () {
			// $('#pattern').on('paste', pasteHandler);
			$('#pattern, #sample').on('keyup change', changeHandler);

			$('#flags input[type="checkbox"]').on('change', changeHandler);
			$('#flags label').on('click', function (event) {
				if (event.which && event.which != 1) {
					return;
				}
				event.preventDefault();
				$('#' + $(this).prop("for")).trigger('click');
			});

			// Setup drag/drop events
			$('#sample, #pattern').each(function () {
				var end = function () {
					$(this).removeClass('dragover');
				};
				this.ondragover = function (event) {
					$(this).addClass('dragover');
				};
				this.ondragend = end;
				this.ondragleave = end;
				this.ondrop = end;
			});

			if (RegexTool.Config.drop_files) {
				$('#sample').each(function () {
					this.ondrop = dropHandler;
				});
			}
		},

		refresh: function () {
			$(result).css('top', layout_input.offset().top + layout_input.outerHeight() + 'px');
		}
	};
}());
