const os = require('os');
const path = require('path')
const express = require('express')
const upload = require('./upload')

const resolve = file => path.join(__dirname, '..', file)

const getLocalIP = () => {
	const network = os.networkInterfaces();
	for (const key in network) {
		const interfaces = network[key];
		for (let i = 0; i < interfaces.length; i++) {
			const face = interfaces[i];
			if (face.family === 'IPv4' && face.address !== '127.0.0.1' && !face.internal) {
				return face.address;
			}
		}
	}
	return 'localhost';
};

const app = express();

app.use((req, res, next) => {
	// 设置是否运行客户端设置 withCredentials
	// 即在不同域名下发出的请求也可以携带 cookie
	res.header("Access-Control-Allow-Credentials", false)
	// 第二个参数表示允许跨域的域名，* 代表所有域名
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
	// 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
	if (req.method == 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
})

app.use(express.static(resolve('public')))

// hello world
app.get('/', (req, res) => {
	res.sendFile(resolve('public/index.html'))
})

// upload
app.post('/upload', upload.any(), function (req, res, next) {
	const file = req.files[0]
	console.log(file)
	const url = file ? file.path.replace(/^\.\.\/src/, '') : ''
	res.send(JSON.stringify({
		code: 1,
		msg: 'OK',
		data: url
	}))
})


const host = getLocalIP()
const port = 8090

const server = app.listen(port, host, () => {
	console.log(`express服务启动成功，访问地址为: http://${host}:${port}`)
})