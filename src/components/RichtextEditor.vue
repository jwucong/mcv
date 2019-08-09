<template>
	<div class="richtext-editor">
		<editor :init="init"></editor>
	</div>
</template>

<script>
	import 'tinymce/tinymce'
	import 'tinymce/themes/silver'
	import Editor from '@tinymce/tinymce-vue'

	export default {
		name: 'RichtextEditor',
		components: {Editor},
		data() {
			return {
				init: {
					base_url: '/plugins/tinymce',
					language: 'zh_CN',
					branding: false,
					resize: false,
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

	.richtext-editor {
		position: relative;
		display: block;
		box-sizing: border-box;
		width: 100%;
	}

</style>