<template>
	<div class="tinymce-editor">
		<editor
			v-model="myValue"
			:init="init"
			:disabled="disabled"
		/>
	</div>
</template>
<script>
	import tinymce from 'tinymce/tinymce'
	import Editor from '@tinymce/tinymce-vue'
	import 'tinymce/themes/silver'
	// 编辑器插件plugins
	// 更多插件参考：https://www.tiny.cloud/docs/plugins/
	// import 'tinymce/plugins/image' // 插入上传图片插件
	// import 'tinymce/plugins/media' // 插入视频插件
	// import 'tinymce/plugins/table' // 插入表格插件
	// import 'tinymce/plugins/lists' // 列表插件
	// import 'tinymce/plugins/wordcount' // 字数统计插件
	export default {
		components: {
			Editor
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			plugins: {
				type: [String, Array],
				default: 'lists image media table wordcount'
			},
			toolbar: {
				type: [String, Array],
				default:
					'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
			}
		},
		data() {
			return {
				init: {
					// language_url: '/tinymce/langs/zh_CN.js',
					// language: 'zh_CN',
					// skin_url: '/tinymce/skins/ui/oxide',
					// skin_url: '/tinymce/skins/ui/oxide-dark',//暗色系
					// height: 740,
					// plugins: this.plugins,
					// toolbar: this.toolbar,
					// branding: false, //是否禁用“Powered by TinyMCE”
					// menubar: true, //顶部菜单栏显示
					// resize: false,
				},
				myValue: this.value
			}
		},
		methods: {
			// 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
			// 需要什么事件可以自己增加
			// onClick(e) {
			//   this.$emit('onClick', e, tinymce)
			// },
		},
		watch: {
			value(newValue) {
				this.myValue = newValue
			}
		}
	}
</script>
