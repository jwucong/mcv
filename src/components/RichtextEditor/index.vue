<template>
	<div class="richtext-editor">
		<editor v-bind="editorProps" v-on="$listeners" />
	</div>
</template>

<script>
	import 'tinymce/tinymce'
	import 'tinymce/themes/silver'
	import 'tinymce/plugins/preview'
	import 'tinymce/plugins/link'
	import 'tinymce/plugins/image'
	import 'tinymce/plugins/media'
	import 'tinymce/plugins/lists'
	import 'tinymce/plugins/hr'
	import 'tinymce/plugins/code'
	import 'tinymce/plugins/table'
	import 'tinymce/plugins/fullscreen'
	import 'tinymce/plugins/charmap'
	import 'tinymce/plugins/emoticons'
	import 'tinymce/plugins/advlist'
	import Editor from '@tinymce/tinymce-vue'
	import defaultEditorConfig from './defaultEditorConfig'
	import imageUploadHandler from './imageUploadHandler'

	const normalizaConfig = (ctx, config) => {
		const imageUploader = config.imageUploader || {}
		config.images_upload_url = imageUploader.url || null
		config.images_upload_handler = imageUploadHandler(imageUploader)
		return config
	}

	export default {
		name: 'RichtextEditor',
		components: {Editor},
		props: {
			config: {
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			editorProps() {
				const config = this.config || {}
				const {
					disabled,
					id,
					initialValue,
					inline,
					tagName,
					plugins,
					toolbar,
					modelEvents,
					apiKey,
					cloudChannel
				} = config
				const init = Object.assign(defaultEditorConfig, config)
				normalizaConfig(this, init)
				return {
					init,
					disabled,
					id,
					initialValue,
					inline,
					tagName,
					plugins,
					toolbar,
					modelEvents,
					apiKey,
					cloudChannel
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