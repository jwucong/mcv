;(function (window) {
	'use strict';

	var tinymce = window.tinymce

	if (!tinymce) {
		return false
	}

	var pluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

	var showDialog = function (editor) {
		editor.windowManager.open({
			title: 'imageUpload',
			height: 300,
			body: {
				type: 'tabpanel',
				tabs: [
					{
						name: 'localImage',
						title: '本地图片',
						items: [
							{
								type: 'urlinput',
								name: 'localImageUploadUrlInput',
								filetype: 'file',
								label: '选择文件'
							}
						]
					},
					{
						name: 'networkImage',
						title: '网络图片',
						items: [
							{
								type: 'input',
								name: 'imageLink',
								label: '图片地址',
								// placeholder: '请输入图片地址'
							},
							{
								type: 'input',
								name: 'imageDesc',
								label: '图片描述',
								// placeholder: '请输入图片描述'
							}
						]
					}
				]
			},
			buttons: [
				{
					type: 'cancel',
					text: 'Close'
				},
				{
					type: 'submit',
					text: 'Save',
					primary: true
				}
			],
			onTabChange: function (api, details) {
				console.log(api)
				console.log(details)
				var data = api.getData();
				console.log('data: ', data)
				console.log('editor: ', editor)
				console.log('editor settings: ', editor.settings)
				console.log('editor imageUploader: ', editor.settings.imageUploader)
				// Insert content when the window form is submitted
				// editor.insertContent('Title: ' + data.title);
				// api.close();
			}
		})
	}

	pluginManager.add('imageUpload', function (editor, pluginUrl) {
		editor.ui.registry.addMenuItem('imageUpload', {
			icon: 'image',
			text: 'ImageUpload...',
			onAction: function () {
				showDialog(editor)
			}
		});
		editor.ui.registry.addButton('imageUpload', {
			icon: 'image',
			text: 'ImageUpload...',
			onAction: function () {
				showDialog(editor)
			}
		});
	});
})(window);