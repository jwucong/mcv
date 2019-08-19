
const getPower = unit => {
	const units = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D'];
	const size = units.length
	for (let i = 0; i < size; i++) {
		const pattern = '^' + units[i] + (i === 0 ? '(?:yte)' : 'b') + '?$'
		const reg = new RegExp(pattern, 'i')
		if (reg.test(unit)) {
			return i
		}
	}
	return -1
}

const toBytes = size => {
	const base = 1000
	const reg = /^\s*\+?((?:\.\d+)|(?:\d+(?:\.\d+)?))\s*([a-z]*)\s*$/i;
	const p = reg.exec(size)
	if (!p) {
		return NaN
	}
	const value = parseFloat(p[1])
	const power = getPower(p[2] || 'B')
	if (Number.isNaN(value) || value < 0 || power < 0) {
		return NaN
	}
	return Math.ceil(value * Math.pow(base, power))
}

const formatBytes = bytes => {
	if (Number.isNaN(parseInt(bytes)) || bytes < 0) {
		return NaN
	}
	const base = 1000
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB']
	const e = Math.floor(Math.log(bytes) / Math.log(base))
	const size = Math.ceil(bytes / Math.pow(base, e))
	return e < units.length ? size + units[e] : NaN
}

const base64ToArrayBuffer = base64 => {
	const str = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
	const binary = atob(str);
	const size = binary.length;
	const buffer = new ArrayBuffer(size);
	const view = new Uint8Array(buffer);
	for (let i = 0; i < size; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
}

const blobToBase64 = (blob, callback) => {
	const reader = new FileReader(blob)
	reader.onload = function () {
		callback(this.result)
	}
	reader.readAsDataURL(file)
}

const getOrientation = buffer => {
	// -2 not jpeg
	// -1 not defined
	const view = new DataView(buffer);
	if (view.getUint16(0, false) != 0xFFD8) {
		return -2
	}
	const size = view.byteLength
	let offset = 2;
	while (offset < size) {
		if (view.getUint16(offset + 2, false) <= 8) {
			return -1
		}
		const marker = view.getUint16(offset, false);
		offset += 2;
		if (marker == 0xFFE1) {
			if (view.getUint32(offset += 2, false) != 0x45786966) {
				return -1;
			}
			const little = view.getUint16(offset += 6, false) == 0x4949;
			offset += view.getUint32(offset + 4, little);
			const tags = view.getUint16(offset, little);
			offset += 2;
			for (let i = 0; i < tags; i++) {
				if (view.getUint16(offset + (i * 12), little) == 0x0112) {
					return view.getUint16(offset + (i * 12) + 8, little)
				}
			}
		} else if ((marker & 0xFF00) != 0xFF00) {
			break;
		} else {
			offset += view.getUint16(offset, false);
		}
	}
	return -1;
}

const fixOrientation = (canvas, orientation) => {
	const width = canvas.width
	const height = canvas.height
	const ctx = canvas.getContext('2d')
	if (orientation > 4) {
		canvas.width = height
		canvas.height = width
	}
	switch (orientation) {
		case 2:
			ctx.transform(-1, 0, 0, 1, width, 0);
			break;
		case 3:
			ctx.transform(-1, 0, 0, -1, width, height);
			break;
		case 4:
			ctx.transform(1, 0, 0, -1, 0, height);
			break;
		case 5:
			ctx.transform(0, 1, 1, 0, 0, 0);
			break;
		case 6:
			ctx.transform(0, 1, -1, 0, height, 0);
			break;
		case 7:
			ctx.transform(0, -1, -1, 0, height, width);
			break;
		case 8:
			ctx.transform(0, -1, 1, 0, 0, width);
			break;
		default:
			ctx.transform(1, 0, 0, 1, 0, 0);
	}
}

function getCompressorOptions(image, options) {
	const w0 = image.naturalWidth
	const h0 = image.naturalHeight
	const r0 = w0 / h0
	const defaults = {
		width: '100%',     // auto or percentage or number
		height: 'auto',    // auto or percentage or number
		minWidth: '60%',
		minHeight: 'auto',
		quality: 75,       // 0 - 100
		minQuality: 60,       // 0 - 100
		error: '15kb',
		maxSize: null,     // 1Mb
		output: 'base64'   // blob or base64
	}
	const pattern = /^\+?((?:\.\d+)|(?:\d+(?:\.\d+)?))\s*\%$/i
	const conf = Object.assign({}, defaults, options)
	const maxSize = toBytes(conf.maxSize) || null
	let quality = parseFloat(conf.quality) || defaults.quality
	let mq = parseFloat(conf.minQuality) || defaults.minQuality
	let output = 'base64'
	quality = (quality < 0 ? 0 : (quality > 100 ? 100 : quality)) / 100
	mq = (mq < 0 ? 0 : (mq > 100 ? 100 : mq)) / 100
	if (typeof conf.output === 'string' && conf.output.trim() === 'blob') {
		output = 'blob'
	}
	const formatter = (val, defaultVal) => {
		let float = parseFloat(val)
		if (!float) {
			return 'auto'
		}
		if (pattern.test(val)) {
			return (float < 0 ? 0 : (float > 100 ? 100 : float)) + '%'
		}
		return float
	}
	let width = formatter(conf.width)
	let height = formatter(conf.height)
	let minWidth = formatter(conf.minWidth)
	let minHeight = formatter(conf.minHeight)
	if (width === 'auto' && height === 'auto') {
		width = '100%'
	}
	if (minWidth === 'auto' && minHeight === 'auto') {
		minWidth = '60%'
	}
	if (pattern.test(width)) {
		width = parseFloat(width) * w0 / 100
	}
	if (pattern.test(height)) {
		height = parseFloat(height) * h0 / 100
	}
	if (width === 'auto') {
		width = height * r0
	}
	if (height === 'auto') {
		height = width / r0
	}
	if (pattern.test(minWidth)) {
		minWidth = parseFloat(minWidth) * w0 / 100
	}
	if (pattern.test(minHeight)) {
		minHeight = parseFloat(minHeight) * h0 / 100
	}
	if (minWidth === 'auto') {
		minWidth = minHeight * r0
	}
	if (minHeight === 'auto') {
		minHeight = minWidth / r0
	}
	const int = value => parseInt(value, 10)
	return {
		quality,
		output,
		maxSize,
		minQuality: mq,
		error: toBytes(conf.error) || toBytes('15kb'),
		width: int(width),
		height: int(height),
		minWidth: int(minWidth),
		minHeight: int(minHeight),
	}
}

function drawImage(canvas, image) {
	const ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

function qCompress(callback, canvas, fileType, maxSize, error, min = 0, max = 1) {
	console.group('qCompress')
	const quality = min + (max - min) / 2
	const threshold = 0.01
	const delta = max - min
	console.log('canvas: ', canvas)
	console.log('fileType: ', fileType)
	console.log('maxSize: ', maxSize)
	console.log('error: ', error)
	console.log('min: ', min)
	console.log('max: ', max)
	console.log('delta: ', delta)
	console.log('quality: ', quality)
	const handler = blob => {
		console.group('qCompress handler')
		console.log('blob: ', blob)
		blob && console.log('size: ', formatBytes(blob.size))
		console.groupEnd()
		if (Math.abs(maxSize - blob.size) <= error || delta <= threshold) {
			return callback(blob)
		}
		if (blob.size > maxSize) {
			qCompress(callback, canvas, fileType, maxSize, error, min, quality)
		} else {
			qCompress(callback, canvas, fileType, maxSize, error, quality, max)
		}
	}
	canvas.toBlob(handler, fileType, quality)
	console.groupEnd()
}

function sCompress(callback, img, canvas, fileType, maxSize, error, min, max) {
	console.group('sCompress')
	const threshold = 0
	const delta = max - min
	const ratio = canvas.width / canvas.height
	const point = Math.floor(min + (max - min) / 2)
	if(ratio < 0) {
		canvas.height = point
		canvas.width = Math.floor(point * ratio)
	} else {
		canvas.width = point
		canvas.height = Math.floor(point / ratio)
	}
	// canvas.width = width
	// canvas.height = Math.floor(width / ratio)
	drawImage(canvas, img)
	console.log('img: ', img)
	console.log('canvas: ', canvas)
	console.log('maxSize: ', maxSize)
	console.log('error: ', error)
	console.log('min: ', min)
	console.log('max: ', max)
	console.log('delta: ', delta)
	console.log('canvas.width: ', canvas.width)
	console.log('canvas.height: ', canvas.height)
	const handler = blob => {
		console.group('sCompress handler')
		console.log('blob: ', blob)
		blob && console.log('size: ', formatBytes(blob.size))
		console.groupEnd()
		if (Math.abs(maxSize - blob.size) <= error || delta <= threshold) {
			return callback(blob)
		}
		if (blob.size > maxSize) {
			sCompress(callback, img, canvas, fileType, maxSize, error, min, point)
		} else {
			sCompress(callback, img, canvas, fileType, maxSize, error, point, max)
		}
	}
	canvas.toBlob(handler, fileType)
	console.groupEnd()
}

function compressor(file, options, callback) {
	if (typeof options === 'function') {
		callback = options
		options = {}
	}
	const fileType = file.type
	const accept = /^image\/(jpe?g|png)$/i
	const exec = data => typeof callback === 'function' && callback(data)
	if (!Boolean(options) || !accept.test(fileType)) {
		exec(file)
	}
	const isPng = /^image\/png$/i.test(fileType)
	const fileName = file.name
	const lastModified = file.lastModified
	const reader = new FileReader()
	reader.onload = function () {
		const base64 = this.result
		const image = new Image()
		image.onload = function () {
			const config = getCompressorOptions(this, options)
			const {maxSize, error, width, height, minWidth, minHeight, minQuality} = config
			const canvas = document.createElement('canvas')
			const buffer = base64ToArrayBuffer(base64)
			const orientation = getOrientation(buffer)
			console.log('orientation: ', orientation)
			console.log(config)
			const output = blob => {
				blob.name = fileName
				blob.lastModified = lastModified
				if (config.output === 'blob') {
					exec(blob)
				} else {
					blobToBase64(blob, exec)
				}
			}
			canvas.width = width
			canvas.height = config.height
			const smin = width / height < 0 ? minHeight : minWidth
			if (orientation > 0) {
				fixOrientation(canvas, orientation)
			}
			drawImage(canvas, this)
			if (isPng) {
				if(canvas.width === image.naturalWidth && canvas.height === image.naturalHeight) {
					const blob = new Blob([buffer], {type: fileType})
					return output(blob)
				} else {
					return sCompress(output, this, canvas, fileType, maxSize, error, smin, width)
				}
			}
			if (maxSize) {
				if (file.size <= error + maxSize) {
					const blob = new Blob([buffer], {type: fileType})
					return output(blob)
				}
				const fn = blob => {
					console.group('qCompress after')
					console.log('blob: ', blob)
					console.log('size: ', formatBytes(blob.size))
					console.groupEnd()
					if (Math.abs(blob.size - maxSize) <= error) {
						output(blob)
					} else {
						if(canvas.width === image.naturalWidth && canvas.height === image.naturalHeight) {
							output(blob)
						} else {
							sCompress(output, this, canvas, fileType, maxSize, error, smin, width)
						}
					}
				}
				return qCompress(fn, canvas, fileType, maxSize, error, minQuality, 1)
			}
			canvas.toBlob(output, fileType, config.quality)
		}
		image.src = base64
	}
	reader.readAsDataURL(file)
}

export default compressor