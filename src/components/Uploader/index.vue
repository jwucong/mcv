<template>
	<div class="com-uploader">
		<label class="com-uploader-label">
			<input
				class="com-uploader-input"
				type="file"
				:multiple="config.multiple">
		</label>
	</div>
</template>

<script>
	import props from './props'

	export default {
		name: 'Uploader',
		props: {
			config: {
				type: Object,
				default: () => props
			}
		}
	}
</script>

<style lang="scss">

</style>