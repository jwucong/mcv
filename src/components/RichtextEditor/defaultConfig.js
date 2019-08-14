export default {
	base_url: '/plugins/tinymce',
	language: 'zh_CN',
	height: 500,
	branding: false,
	resize: false,
	statusbar: false,
	imageUploader: {
		url: '//um.10get.com/api/content/source/upload/image',
		data: {
			contentType: 1,
			microPagImage: 1
		},
		headers: {
			UBToken: 'kQa2NQnoOTnEYSjyDr3YbQVitvcWFn1G'
		},
		timeout: 0,
		withCredentials: false,
		fileValidator: function(blobInfo) {
			const accept = /^image\/(jpe?g|png|gif)$/i;
			const file = blobInfo.blob();
			const flag = accept.test(file.type);
			return flag ? true : '仅支持上传jpg、jpeg、png、gif格式的图片';
		},
		uploadBefore: null,
		uploadAfter: null,
		uploadSuccess: null,
		uploadError: null,
		uploadComplete: null,
		customUploadHandler: null
	},
	toolbar: [
		'fontselect fontsizeselect',
		'forecolor backcolor',
		'bold italic underline strikethrough',
		'alignleft aligncenter alignright alignjustify',
		'bullist numlist indent outdent',
		'link unlink',
		'image media'
	].join('|'),
	menubar: 'view edit insert format',
	menu: {
		view: {
			title: 'View',
			items: 'preview fullscreen visualaid'
		},
		edit: {
			title: 'Edit',
			items: 'undo redo | cut copy paste pastetext | selectall'
		},
		insert: {
			title: 'Insert',
			items: 'link image media | inserttable hr emoticons charmap code'
		},
		format: {
			title: 'Format',
			items:
				'bold italic underline strikethrough superscript subscript | formats | removeformat'
		}
	},
	contextmenu: 'image table',
	contextmenu_never_use_native: true,
	plugins:
		'preview link image media lists table code fullscreen hr charmap emoticons advlist',
	fontsize_formats: '12px 14px 16px 18px 24px 36px 48px'
};
