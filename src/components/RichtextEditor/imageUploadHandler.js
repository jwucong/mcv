import {is, isEmptyValue} from "@/utils";

const exec = (fn, ...args) => {
	return is(fn, 'function') ? fn.apply(null, args) : false
}

const each = (object, fn) => {
	if(!is(object, 'object')) {
		return
	}
	for (const key in object) {
		if (Object.hasOwnProperty.call(object, key)) {
			exec(fn, key, object[key])
		}
	}
}

let uploadSuccessFlag = false

const xhrOnLoadHandler = (xhr, imageUploader, success, failure) => {
	const {uploadSuccess, uploadError, uploadComplete} = imageUploader
	const errorMsg = msg => 'Error: ' + msg
	return function onLoadHandler() {
		if (xhr.status !== 200) {
			failure(errorMsg(xhr.status))
			exec(uploadError, 'http status is not 200', xhr)
			exec(uploadComplete, xhr)
			return
		}
		try {
			const response = JSON.parse(xhr.responseText);
			if (response.code !== 1) {
				failure(errorMsg(response.msgZ))
				exec(uploadError, response, xhr)
				exec(uploadComplete, xhr)
				return;
			}
			const data = response.data || {}
			success(data.url || '')
			uploadSuccessFlag = true
			exec(uploadSuccess, response, xhr)
			exec(uploadComplete, xhr)
		} catch (e) {
			const tips = errorMsg('json parse error')
			failure(tips)
			exec(uploadError, tips, xhr)
			exec(uploadComplete, xhr)
		}
	}
}

export default function (config = {}) {
	const imageUploader = config
	const {
		fileValidator,
		uploadBefore,
		uploadAfter,
		url,
		data,
		headers,
		timeout,
		withCredentials
	} = imageUploader
	let timerId = null
	return function imageUploadHandler(blobInfo, success, failure) {
		uploadSuccessFlag = false
		const flag = is(fileValidator, 'function') ? fileValidator(blobInfo) : true
		if(flag !== true) {
			failure(is(flag, 'string') ? flag : '文件校验失败!')
			return
		}
		const xhr = new XMLHttpRequest();
		const formData = new FormData()
		formData.append('file', blobInfo.blob(), blobInfo.filename())
		xhr.withCredentials = withCredentials || false;
		xhr.open('POST', url);
		xhr.onload = xhrOnLoadHandler(xhr, imageUploader, success, failure)
		each(data, (key, value) => formData.append(key, value))
		each(headers, (key, value) => xhr.setRequestHeader(key, value))
		exec(uploadBefore, formData, xhr)
		xhr.send(formData)
		const cancelFn = function(reason) {
			if(uploadSuccessFlag) {
				return
			}
			xhr.abort()
			failure(reason || 'cancel')
		}
		exec(uploadAfter, xhr, cancelFn)
		clearTimeout(timerId)
		const ms = parseInt(timeout, 10)
		if(ms && ms > 0) {
			timerId = setTimeout(() => {
				xhr.abort()
				failure('上传超时!')
			}, ms)
		}
	}
}