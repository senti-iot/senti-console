
// import localizationJSON from "variables/localization"
import loc from 'variables/localization/index'
import { saveSettingsOnServ } from './settings';
var forEach = require('for-each');

//Action types

const changeLangAction = "LANG"
const GETSETTINGS = "GET_SETTINGS"

//Actions
export const changeLanguage = (code) => {
	return async (dispatch, getState) => {
		dispatch(
			{ type: changeLangAction,
				code
			})
		dispatch(saveSettingsOnServ())
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
		}
	}, this);
	return phrases
};

//Reducer
const initialState = {
	language: "da",
	s: extend(loc["da"])
}
export const localization = (state = initialState, action) => {
	switch (action.type) {
		case GETSETTINGS: 
			return Object.assign({}, state, {
				language: action.settings.language,
				s: extend(loc[action.settings.language])
			})
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
