<template>
	<div class="home">
		<!--		<richtext-editor v-model="content"></richtext-editor>-->
		<!--		<scss-test></scss-test>-->
		<a class="um-wx-btn primary" href="javascript:;">button</a>
	</div>
</template>

<script>
import RichtextEditor from '@/components/RichtextEditor';
import ScssTest from './ScssTest';

export default {
	name: 'home',
	components: {
		RichtextEditor,
		ScssTest
	},
	data() {
		return {
			content: '<div style="font-size: 24px;">tesla13</div>'
		};
	},
	mounted() {},
	methods: {
		btnClick(e) {
			e.preventDefault();
		}
	}
};
</script>

<style lang="scss">
@import '../assets/style/style';
</style>
