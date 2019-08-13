const exec = function (fn, ...args) {
	if (typeof fn !== 'function') {
		return
	}
	return fn.apply(null, args)
}

const isObject = value => {
	return Object.prototype.toString.call(value).slice(8, -1) === 'Object'
}

const xhrOnLoadHandler = function (xhr, imageUploader, editorCallbacks) {
	const {uploadSuccess, uploadError} = imageUploader
	const {success, failure} = editorCallbacks
	return function onLoadHandler() {
		if (xhr.status !== 200) {
			failure(xhr)
			exec(uploadError, 'http status is not 200', xhr)
			return
		}
		try {
			const response = JSON.parse(xhr.responseText);
			if (response.code !== 1) {
				failure(response.msgZ)
				exec(uploadError, response, xhr)
				return;
			}
			const responseData = response.data || {}
			const location = responseData.url || ''
			success(location)
			exec(uploadSuccess, response, xhr)
		} catch (e) {
			const tips = 'json parse error: ' + xhr.responseText
			failure(tips)
			exec(uploadError, tips, xhr)
		}
	}
}

export default function (config = {}) {
	const imageUploader = config
	const {uploadBefore, url, data, headers, withCredentials} = imageUploader
	return function imageUploadHandler(blobInfo, success, failure) {
		const xhr = new XMLHttpRequest();
		const formData = new FormData()

		formData.append('file', blobInfo.blob(), blobInfo.filename())
		xhr.withCredentials = withCredentials || false;

		xhr.open('POST', url);
		xhr.onload = xhrOnLoadHandler(xhr, imageUploader, {success, failure})

		if(isObject(data)) {
			for (const key in data) {
				if(Object.hasOwnProperty.call(data, key)) {
					formData.append(key, data[key])
				}
			}
		}

		if(isObject(headers)) {
			for (const key in headers) {
				if(Object.hasOwnProperty.call(headers, key)) {
					xhr.setRequestHeader(key, headers[key]);
				}
			}
		}

		exec(uploadBefore, formData, xhr)
		xhr.send(formData)
	}
}