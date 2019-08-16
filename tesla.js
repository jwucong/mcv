function getCompressorOptions(options) {
	const defaults = {
		width: '100%',     // auto or percentage or pixel
		height: 'auto',    // auto or percentage or pixel
		quality: 75,       // 0 - 100
		maxSize: '',       // 1Mb
		output: 'blob'     // blob or base64
	}
	const conf = Object.assign({}, defaults, options)
	return conf
}

console.log(getCompressorOptions(1))