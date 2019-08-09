<template>
  <div class="home">
		<richtext-editor></richtext-editor>
  </div>
</template>

<script>
	import RichtextEditor from '@/components/RichtextEditor'

export default {
  name: 'home',
  components: {
		RichtextEditor
  },
	data() {
  	return {
  		content: '',
		}
	}
}
</script>
