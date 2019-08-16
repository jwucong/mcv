// getPower('kb') => 1
import {is, isEmptyValue} from "@/utils";

const isPercent = val => /\%$/.test(val)

const isPlainObject = value => {
	return is(value, 'object') && Object.keys(value).length === 0
}

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
	const pattern = /^\s*\+?((?:\.\d+)|(?:\d+(?:\.\d+)?))\s*([a-z]*)\s*$/i;
	const p = pattern.exec(size)
	if (!p) {
		return NaN
	}
	const value = parseFloat(p[1])
	const power = getPower(p[2] || 'B')
	if (Number.isNaN(value) || value < 0 || power < 0) {
		return NaN
	}
	return Math.ceil(value * Math.pow(1024, power))
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

const fixOrientation = (canvas, ctx, orientation) => {
	const width = canvas.width
	const height = canvas.height
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

const normalizeCompressorConfig = config => {
	const parse = value => {
		if (/\d+\s*(px)\s*$/i.test(value)) {
			return parseInt(value, 10) || '100%'
		}
		if (/\d+\s*\%\s*$/i.test(value)) {
			return parseFloat(value) + '%' || '100%'
		}
		return value === 'auto' ? value : '100%'
	}
	let width = parse(config.width)
	let height = parse(config.height)
	let q = parse(config.quality)
	if (width === 'auto' && height === 'auto') {
		width = '100%'
	}
	const quality = q === 'auto' ? 75 : (isPercent(q) ? parseFloat(q) : q)
	const maxSize = toBytes(config.maxSize) || null
	const output = config.output === 'blob' ? 'blob' : 'base64'
	return {width, height, quality, maxSize, output}
}

const compress = (file, options, callback) => {
	const isImage = /^image\//.test(file.type)
	if (!isImage) {
		return
	}
	if (typeof options === 'function') {
		callback = options
		options = {}
	}
	const exec = (...arg) => {
		if (!is(callback, 'function')) {
			return false
		}
		return callback.apply(null, arg)
	}
	const defaults = {
		width: '100%',     // auto or percentage or pixel
		height: 'auto',    // auto or percentage or pixel
		quality: 75,       // 0 - 100
		maxSize: '',       // 1Mb
		output: 'blob'     // blob or base64
	}
	let config
	if (!options) {
		config = false
	} else {
		config = is(options, 'object') ? Object.assign(defaults, options) : defaults
	}
	config = normalizeCompressorConfig(config)
	const reader = new FileReader()
	reader.onload = function () {
		const base64 = this.result
		if (!config) {
			// TODO 不压缩
			exec(base64)
		}
		const image = new Image()
		image.onload = function () {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			const buffer = base64ToArrayBuffer(base64)
			const orientation = getOrientation(buffer)
			const w0 = image.naturalWidth
			const h0 = image.naturalHeight
			const r0 = w0 / h0
			const sw = config.width
			const sh = config.height
			let cvw = sw, cvh = sh
			if (isPercent(sw)) {
				cvw = parseFloat(sw) / 100 * w0
			}
			if (isPercent(sh)) {
				cvh = parseFloat(sh) / 100 * h0
			}
			if (cvw === 'auto') {
				cvw = cvh * r0
			}
			if (cvh === 'auto') {
				cvh = cvw / r0
			}
			cvw = Math.floor(cvw > w0 ? w0 : cvw)
			cvh = Math.floor(cvh > sh ? sh : cvh)
			canvas.width = cvw
			canvas.height = cvh
			if (orientation > 0) {
				fixOrientation(canvas, ctx, orientation)
			}
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			if (!config.maxSize) {
				const args = [file.type]
				if (/^image\/jpe?g$/i.test(file.type)) {
					args.push(config.quality / 100)
				}
				const newImageBase64 = canvas.toDataURL.apply(null, args);
			}

		}
		image.src = base64
	}
	reader.readAsDataURL()
}

function getCompressorOptions(options) {
	const defaults = {
		width: '100%',     // auto or percentage or number
		height: 'auto',    // auto or percentage or number
		quality: 75,       // 0 - 100
		maxSize: '',       // 1Mb
		output: 'base64'     // blob or base64
	}
	const conf = Object.assign({}, defaults, options)
	const pattern = /^\+?((?:\.\d+)|(?:\d+(?:\.\d+)?))\s*\%$/i;
	const format = val => parseInt(val, 10) || '100%'
	const parse = value => {
		const type = typeof value
		if (type !== 'string') {
			return format(value)
		}
		let val = value.trim()
		if (pattern.test(val)) {
			val = parseFloat(val)
			return val ? val + '%' : '100%'
		}
		return val === 'auto' ? val : format(val)
	}
	let quality = parse(conf.quality)
	let output = conf.output
	if(typeof quality === 'string') {
		quality = quality === 'auto' ? defaults.quality : parseFloat(quality) / 100
	}
	quality = quality > 100 ? 100 : (quality < 0 ? 0 : quality)
	if (typeof output !== 'string') {
		output = 'base64'
	} else {
		output = output.trim() === 'blob' ? 'blob' : 'base64'
	}
	return {
		quality,
		output,
		width: parse(conf.width),
		height: parse(conf.height),
		maxSize: toBytes(conf.maxSize) || null
	}
}

function setCanvasSize(canvas, options) {

}

function compressToSize(canvas, callback, maxSize, min = 0, max = 1) {
	const quality = min + (max - min) / 2
	const handler = blob => {
		if (quality <= 0.01 || Math.abs(max - min) <= 0.01) {
			return callback(blob)
		}
		if(blob.size > limit) {
			compress(callback, maxSize, min, quality)
		} else {
			compress(callback, maxSize, quality, max)
		}
	}
	canvas.toBlob(handler, 'image/jpeg', quality)
}

function compressor(file, options, callback) {

}