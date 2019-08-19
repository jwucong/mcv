<template>
	<div class="home">
		<!--		<richtext-editor v-model="content"></richtext-editor>-->
		<!--		<scss-test></scss-test>-->
		<label class="um-wx-btn primary">
			<span>upload</span>
			<input type="file" style="display: none" @change="handleFileChange">
		</label>

		<a class="um-wx-btn primary" href="javascript:;"  @click="handleUpload" style="margin: 30px 0;">button</a>

		<img class="preview" :src="preview" alt="">
	</div>
</template>

<script>
import RichtextEditor from '@/components/RichtextEditor';
import ScssTest from './ScssTest';

import {formatBytes} from "@/utils";
import compressor from "@/components/Uploader/utils";

export default {
	name: 'home',
	components: {
		RichtextEditor,
		ScssTest
	},
	data() {
		return {
			content: '<div style="font-size: 24px;">tesla13</div>',
			files: [],
			preview: ''
		};
	},
	mounted() {},
	methods: {
		btnClick(e) {
			e.preventDefault();
		},
		previewImage(blob) {
			const that = this
			const reader = new FileReader()
			reader.onload = function () {
				that.preview = this.result
			}
			reader.readAsDataURL(blob)
		},
		handleUpload() {
			if(this.files.length) {
				const file = this.files[0]
				console.log('file size: ', formatBytes(file.size))
				compressor(file, {
					width: 'auto',
					output: 'blob',
					minQuality: 60,
					maxSize: '1mb'
				}, blob => {
					console.log(blob)
					console.log('blob size: ', formatBytes(blob.size))
					this.previewImage(blob)
					this.upload(blob, (res) => {
						console.log(res)
					})
				})
			} else {
				console.log('no file')
			}
		},
		handleFileChange(event) {
			const target = event.target
			const files = target.files
			const first = files[0]
			this.files = files
			console.log('first: ', first)
			console.log('this.files: ', this.files)
			console.log('first size: ', formatBytes(first.size))
		},
		upload(file, callback) {
			const url = 'http://192.168.111.100:8090/upload'
			const formData = new FormData()
			const xhr = new XMLHttpRequest()
			formData.append('file', file, file.name || '');
			xhr.open('POST', url);
			xhr.onload = function() {
				const json = JSON.parse(xhr.responseText)
				typeof callback === 'function' && callback(json)
			};
			xhr.send(formData);
		}
	}
};
</script>

<style lang="scss">
@import '../assets/style/style';

	.preview {
		display: block;
		margin: 0 12px;
		width: calc(100% - 24px);
	}
</style>
