/* eslint-disable no-func-assign */
import store from 'store';

let PREFIX = 'senti';

export const setPrefix = (id) => {
	if (PREFIX.includes(id)) {
		PREFIX = 'senti.' + id + '.'
	}
	else {
		PREFIX = PREFIX + '.' + id + '.'
	}
}
export function del(key) {
	return store.remove(PREFIX + key)
}
export function get(key) {
	return store.get(PREFIX + key);
}
export const setAll = (key, value) => {
	return store.set('senti.' + key, value)
}
export const getAll = (key) => {
	return store.get('senti.' + key)
}
export function set(key, value) {
	return store.set(PREFIX + key, value);
}

function init() {
	if (!store.enabled) {
		get = function() {};
		set = function() {};
	}
}

init();
