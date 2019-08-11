<template>
  <div class="home">
		<richtext-editor v-model="content" :config="config"></richtext-editor>
  </div>
</template>

<script>
	import RichtextEditor from '@/components/RichtextEditor'
	import loadsh from 'lodash'

	import {copy, isEqual} from "../utils";

	export default {
  name: 'home',
  components: {
		RichtextEditor
  },
	data() {
  	return {
  		content: 'tesla',
			config: {
  			toolbar: ''
			}
		}
	},
	mounted() {

	}
}
</script>
