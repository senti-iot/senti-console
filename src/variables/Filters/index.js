import { filterItems } from 'variables/functions';
import moment from 'moment'

function index(obj, is, value) {
	if (is)
		if (typeof is == 'string')
			return index(obj, is.split('.'), value);
		else if (is.length === 1 && value !== undefined)
			return obj[is[0]] = value;
		else if (is.length === 0)
			return obj;
		else
			return index(obj[is[0]], is.slice(1), value);
	else {
		return null
	}
}
const filterByDate = (items, k) => {
	return items = items.reduce((newArr, d) => {
		let objVal = index(d, k.key)
		if (objVal)
			if (k.value.after) {
				if (moment(objVal).isAfter(moment(k.value.date)))
					newArr.push(d)
			}
			else {
				if (moment(objVal).isBefore(moment(k.value.date)))
					newArr.push(d)
			}
		return newArr
	}, [])
}
const filterByString = (items, k) => {
	if (k.key === "") {
		return items = filterItems(items, { keyword: k.value })
	}
	else
		return items = items.reduce((newArr, d) => {
			let objVal = index(d, k.key)
			if (objVal)
				if (objVal.toString().toLowerCase().includes(k.value.toLowerCase()))
					newArr.push(d)
			return newArr
		}, [])
}
export const customFilterItems = (items, keyValues) => {
	keyValues.forEach(k => {
		switch (k.type) {
			case 'string':
				items = filterByString(items, k)
				break;
			case 'date':
				items = filterByDate(items, k)
				break;
			default:
				break;
		}
	})
	return items
}
