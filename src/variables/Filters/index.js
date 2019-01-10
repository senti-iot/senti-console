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
			if (objVal !== null)
				if (objVal.toString().toLowerCase().includes(k.value.toString().toLowerCase()))
					newArr.push(d)
			return newArr
		}, [])
}
const filterByDiff = (items, k) => { 
	console.log(k)
	items = items.reduce((newArr, d) => { 
		let objVal = index(d, k.key)
		if (objVal !== null) { 
			if (k.value.diff) {
				if (k.value.values.false.indexOf(objVal) === -1)
					newArr.push(d)
			}
			else { 
				if (k.value.values.false.indexOf(objVal) !== -1)
					newArr.push(d)
			}
		}
		return newArr
	}, [])
	console.log(items)
	return items
}
export const customFilterItems = (items, keyValues) => {
	keyValues.forEach(k => {
		console.log(k)
		switch (k.type) {
			case 'string':
			case 'dropDown':
				items = filterByString(items, k)
				break;
			case 'date':
				items = filterByDate(items, k)
				break;
			case 'diff':
				items = filterByDiff(items, k)
				break;
			default:
				break;
		}
	})
	return items
}
