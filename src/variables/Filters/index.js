import { filterItems } from 'variables/functions';

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
export const customFilterItems = (items, keyValues) => { 
	keyValues.map(k => {
		if (k.key === "")
		{ 
			return items = filterItems(items, { keyword: k.value })
		}
		else 
			return items = items.reduce((newArr, d) => {
				let objVal = index(d, k.key)
				if (objVal)
					if (objVal.toString().includes(k.value))
						newArr.push(d)
				return newArr
			}, [])
	})
	return items
}
