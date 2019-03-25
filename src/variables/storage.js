/* eslint-disable no-func-assign */
import store from 'store';

let PREFIX = 'senti';
export const setPrefix = (id) => {
	PREFIX = PREFIX + '.' + id
}
export function get(key) {
	return store.get(PREFIX + key);
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
