const multer = require('multer')
const mime = require('mime')

const getNo = (() => {
	let n = 0
	return function () {
		n = ++n > 1000 ? 1 : n
		return n.toString().padStart(4, 0)
	}
})();

const storage = multer.diskStorage({
	destination(req, file, cb) {
		console.log('output file size', file.size)
		cb(null, '../src/assets/uploads/')
	},
	filename(req, file, cb) {
		console.log('file: ', file)
		const ext = mime.getExtension(file.mimetype);
		const name = formatDate(Date.now(), 'yyyyMMddhhmmss') + getNo()
		console.log(ext)
		cb(null, `${name}.${ext}`)
	}
})

const upload = multer({
	storage: storage,
	fileFilter(req, file, cb) {
		const mime = file.mimetype
		const isImg = /\/(jpe?g|png|gif)$/i.test(mime)
		cb(null, isImg)
	}
})


function formatDate(date = Date.now(), formatter = 'yyyy-MM-dd hh:mm:ss') {
	const fix = n => n < 10 ? '0' + n : n + ''
	const d = new Date(date)
	const map = {
		'yyyy': d.getFullYear(),
		'MM': d.getMonth() + 1,
		'dd': d.getDate(),
		'hh': d.getHours(),
		'mm': d.getMinutes(),
		'ss': d.getSeconds()
	}
	return Object.keys(map).reduce((acc, key) => {
		return acc.replace(new RegExp(key, 'g'), fix(map[key]))
	}, formatter)
}

module.exports = upload