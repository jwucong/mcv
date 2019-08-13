;(function(window) {
	// 'use strict';

	var plugin = window.tinymce.util.Tools.resolve('tinymce.PluginManager');

	function registerPlugin () {
		plugin.add('imageUpload', function (editor, pluginUrl) {
			editor.windowManager.open({
				title: 'imageUpload',
				width: 320,
				height: 240
			})
		});
	}

	registerPlugin();
})(window);