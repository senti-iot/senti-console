
function index(obj, is, value) {
	if (typeof is == 'string')
		return index(obj, is.split('.'), value);
	else if (is.length === 1 && value !== undefined)
		return obj[is[0]] = value;
	else if (is.length === 0)
		return obj;
	else
		return index(obj[is[0]], is.slice(1), value);
}
export const customFilterItems = (items, keyValues) => { 
	// console.log(keyValues)
	// console.log(items)
	keyValues.map(k => {
		return items = items.reduce((newArr, d) => {
			let objVal = index(d, k.key)
			if (objVal.toString().includes(k.value))
				newArr.push(d)
			return newArr
		}, [])
	})
	// console.log(items)
	return items
}
