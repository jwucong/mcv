<template>
	<div class="com-richtext-editor">
		<editor v-model="content" v-bind="props" v-on="$listeners" />
	</div>
</template>

<script>
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/advlist';
import Editor from '@tinymce/tinymce-vue';
import defaultConfig from './defaultConfig';
import imageUploadHandler from './imageUploadHandler';

const normalizaConfig = config => {
	const imageUploader = config.imageUploader || {};
	const customHandler = imageUploader.customUploadHandler;
	const custom = typeof customHandler === 'function';
	const handler = custom ? customHandler : imageUploadHandler(imageUploader);
	config.images_upload_url = imageUploader.url;
	config.images_upload_credentials = imageUploader.withCredentials;
	config.images_upload_handler = handler;
	return config;
};

export default {
	name: 'RichtextEditor',
	components: {
		Editor
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		config: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		props() {
			const config = this.config || {};
			const init = Object.assign(defaultConfig, config);
			return {
				init: normalizaConfig(init),
				disabled: config.disabled,
				id: config.id,
				initialValue: config.initialValue,
				inline: config.inline,
				tagName: config.tagName,
				plugins: config.plugins,
				toolbar: config.toolbar,
				modelEvents: config.modelEvents,
				apiKey: config.apiKey,
				cloudChannel: config.cloudChannel
			};
		},
		content: {
			get() {
				return this.value;
			},
			set(value) {
				if(value !== this.value) {
					this.$emit('input', value);
				}
			}
		}
	}
};
</script>

<style lang="scss">
.com-richtext-editor {
	position: relative;
	display: block;
	box-sizing: border-box;
	width: 100%;
}
</style>
