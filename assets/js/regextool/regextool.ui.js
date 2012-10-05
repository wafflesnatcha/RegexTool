/*jshint browser:true, jquery:true*/
/*global RegexTool, log*/
RegexTool.UI = (function () {
	
	// Add noflexbox class as soon as jQuery is available
	jQuery(function() {
		$('html').addClass('noflexbox');
	});
	
	function changeHandler(event) {
		if ($(event.target).val() !== RegexTool.Storage.get(event.target)) {
			RegexTool.Storage.saveElement(event.target);
			if (RegexTool.Pattern.getExp()) {
				RegexTool.triggerRefresh();
			}
		}
	}

	function dropHandler(event) {
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

	return {
		init: function () {
			// Flexbox supported
			if ($('body').css('boxDirection')) {
				$('html').removeClass('noflexbox').addClass('flexbox');
			} else {
				$('html').removeClass('flexbox').addClass('noflexbox');
				var layout_input = $('#regextool > .layout-input');
				$('#section-result').css('top', layout_input.offset().top + layout_input.height() + 'px');
			}

			// Autofocus support
			var autofocus_el = $('form input[autofocus], form textarea[autofocus]').first();
			if (autofocus_el) {
				autofocus_el.focus();
			}
		},

		initInput: function () {

			$('#pattern, #sample').on('change', changeHandler);
			$('#pattern, #sample').on('keyup keydown', function (event) {
				setTimeout(function () {
					$(event.target).trigger('change');
				}, 1);
			});

			// Toggle flag
			$('#flags input[type="checkbox"]').on('change', changeHandler);
			$('#flags label').on('click', function (event) {
				if (event.which && event.which != 1) {
					return;
				}
				event.preventDefault();
				$('#' + $(this).prop("for")).trigger('click');
			});

			// Watch for paste and fix pattern
			if (RegexTool.Config.fix_pasted_pattern) {
				$('#pattern').on('paste', function (event) {
					event.stopPropagation();
					setTimeout(function () {
						if (RegexTool.Pattern.fix($(event.target).val())) {
							RegexTool.triggerRefresh();
						}
					}, 0);
				});
			}

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

			if (RegexTool.Config.allow_drop_files) {
				$('#sample').each(function () {
					this.ondrop = dropHandler;
				});
			}
		}
	};
}());