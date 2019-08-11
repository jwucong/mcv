<template>
	<div class="richtext-editor">
		<editor
			v-bind="editorProps"
			v-on="$listeners">
		</editor>
	</div>
</template>

<script>
	import 'tinymce/tinymce'
	import 'tinymce/themes/silver'
	import Editor from '@tinymce/tinymce-vue'
	import { copy } from "@/utils";

	export default {
		name: 'RichtextEditor',
		components: {Editor},
		props: {
			config: {
				type: Object,
				default: () => ({

				})
			}
		},
		data() {
			return {
			}
		},
		computed: {
			editorProps() {
				/**
				 * disabled
				 * id
				 * init
				 * initial-value
				 * inline
				 * tag-name
				 * plugins
				 * toolbar
				 * model-events
				 * api-key
				 * cloud-channel
				 */
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
				} = this.config
				const init = Object.assign({
					base_url: '/plugins/tinymce',
					language: 'zh_CN',
					branding: false,
					resize: false,
					statusbar: false,
					menubar: true
				}, this.config || {})
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