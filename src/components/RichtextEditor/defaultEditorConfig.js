export default {
	base_url: '/plugins/tinymce',
	language: 'zh_CN',
	height: 500,
	branding: false,
	resize: false,
	statusbar: false,
	images_upload_url: '/localUpload',
	images_upload_handler: null,
	images_upload_credentials: true,
	imageUploader: {
		url: '//um.10get.com/api/content/source/upload/image',
		multiple: false,
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
			console.group('fileValidator')
			console.log('blobInfo: ', blobInfo)
			console.groupEnd()
			const accept = /^image\/(jpe?g|png|gif)$/i
			const file = blobInfo.blob()
			return accept.test(file.type)
		},
		uploadBefore: function (formData, xhr) {
			console.group('uploadBefore')
			console.log('formData: ', formData)
			console.log('xhr: ', xhr)
			console.groupEnd()
		},
		uploadAfter: function(xhr, cancel) {
			console.group('uploadAfter')
			console.log('xhr: ', xhr)
			console.log('cancel: ', cancel)
			console.groupEnd()
		},
		uploadSuccess: function (data, xhr) {
			console.group('uploadSuccess')
			console.log('data: ', data)
			console.log('xhr: ', xhr)
			console.groupEnd()
		},
		uploadError: function (data, xhr) {
			console.group('uploadError')
			console.log('data: ', data)
			console.log('xhr: ', xhr)
			console.groupEnd()
		},
		uploadComplete: function (xhr) {
			console.group('uploadComplete')
			console.log('xhr: ', xhr)
			console.groupEnd()
		},
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
	menubar: 'view edit insert format tools',
	menu: {
		edit: {
			title: 'Edit',
			items: 'undo redo | cut copy paste pastetext | selectall'
		},
		insert: {
			title: 'Insert',
			items: 'link image media | inserttable hr emoticons charmap code'
		},
		view: {
			title: 'View',
			items: 'preview fullscreen visualaid'
		},
		format: {
			title: 'Format',
			items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
		},
		table: {
			title: 'Table',
			items: 'inserttable tableprops deletetable | cell row column'
		},
		tools: {
			title: 'Tools',
			items: 'code'
		}
	},
	plugins: "preview link image media lists table code fullscreen hr charmap emoticons advlist",
	fontsize_formats: '12px 14px 16px 18px 24px 36px 48px'
}