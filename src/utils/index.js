const hasKey = Object.prototype.hasOwnProperty;
const slice = Array.prototype.slice;

export const is = (value, type) => {
	const tag = Object.prototype.toString.call(value).slice(8, -1);
	const test = typeof type === 'string' && type.trim().length > 0;
	return test ? tag.toLocaleLowerCase() === type.toLocaleLowerCase() : tag;
};

export const isPrimitiveType = value => {
	const type = is(value);
	const primitives = [
		'Number',
		'String',
		'Boolean',
		'Null',
		'Undefined',
		'Symbol',
		'BigInt'
	];
	return primitives.includes(type);
};

export const isEmptyValue = value => {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return true;
	}
	return typeof value === 'string' && value.trim() === '';
};

export const isEqual = (a, b) => {
	if (a === b || (Number.isNaN(a) && Number.isNaN(b))) {
		return true;
	}
	const type = is(a);
	if (type !== is(b)) {
		return false;
	}
	if (type === 'Date') {
		return a.getTime() === b.getTime();
	}
	if (type === 'RegExp') {
		const reg = /\w*$/;
		const fa = reg.exec(a)[0];
		const fb = reg.exec(b)[0];
		return a.source === b.source && fa === fb && a.lastIndex === b.lastIndex;
	}
	if (type === 'Object' || type === 'Array') {
		const keys = Object.keys(a);
		if (keys.length !== Object.keys(b).length) {
			return false;
		}
		return keys.every(key => isEqual(a[key], b[key]));
	}

	return false;
};

export const copy = (value, deep = false) => {
	// primitives and function(Functions should not be cloned)
	if (isPrimitiveType(value) || typeof value === 'function') {
		return value;
	}
	// Object Array Date RegExp
	const type = is(value);
	if (type === 'Object' || type === 'Array') {
		const result = type === 'Object' ? {} : [];
		for (const key in value) {
			if (hasKey.call(value, key)) {
				result[key] = deep ? copy(value[key]) : value[key];
			}
		}
		return result;
	}
	if (type === 'Date') {
		return new Date(value);
	}
	if (type === 'RegExp') {
		const flags = /\w*$/.exec(value)[0];
		const clone = new RegExp(value.source, flags);
		clone.lastIndex = value.lastIndex;
		return clone;
	}
	return null;
};


export const formatBytes = bytes => {
	if (bytes < 0) {
		return NaN
	}
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB']
	const e = Math.floor(Math.log(bytes) / Math.log(1024))
	const size = Math.ceil(bytes / Math.pow(1024, e))
	return e < units.length ? size + units[e] : NaN
}