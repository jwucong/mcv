export default {
	label: {
		type: String,
		default: '选择文件'
	},
	multiple: {
		type: Boolean,
		default: false
	},
	maxSize: [String, Number],
	autoUpload: {
		type: Boolean,
		default: false
	}
}