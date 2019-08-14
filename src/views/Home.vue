<template>
	<div class="home">
		<richtext-editor v-model="content"></richtext-editor>
		<scss-test></scss-test>
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
	mounted() {}
};
</script>
