const props = {
	a: 1,
	init: {
		nihao: 2
	}
}
const init = Object.assign({
	base_url: '/plugins/tinymce',
	language: 'zh_CN',
	branding: false,
	resize: false,
}, props.init || {})
const f = Object.assign({}, props, {init})

console.log(f)