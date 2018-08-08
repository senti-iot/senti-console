
// import localizationJSON from "variables/localization"
import loc from 'variables/localization/index'
var forEach = require('for-each');
console.log(loc)
//Action types
const changeLangAction = "LANG"
//Actions
export const changeLanguage = (code) => { 
	return {
		type: changeLangAction,
		code
	}
}

//Polyglot Code modified to be tied to Redux - http://airbnb.io/polyglot.js/
let phrases = []
const extend = (morePhrases, prefix) => {
	forEach(morePhrases, function (phrase, key) {
		var prefixedKey = prefix ? prefix + '.' + key : key;
		if (typeof phrase === 'object') {
			extend(phrase, prefixedKey);
		} else {
			phrases[prefixedKey] = phrase;
			// console.log(phrase, key, phrases)
		}
	}, this);
	// console.log(phrases)
	return phrases
};

//Reducer
const initialState = {
	language: "en",
	s: extend(loc["en"])
}
// console.log(initialState)
export const localization = (state = initialState, action) => {
	switch (action.type) {

		case changeLangAction:
			phrases = []
			return Object.assign({}, state, {
				language: action.code,
				s: extend(loc[action.code])
			})
		
		default:
			return state
	}
}
