
import loc from 'variables/localization/index'
import { saveSettingsOnServ } from './settings';
import { getDaysOfInterest } from './doi';
var forEach = require('for-each');

const changeLangAction = 'changeLanguage'
const GETSETTINGS = 'getSettings'
const NOSETTINGS = 'noSettings'

export const changeLanguage = (code, noSave) => {
	return async (dispatch, getState) => {
		dispatch(
			{ type: changeLangAction,
				code
			})
		if (!noSave)
			dispatch(saveSettingsOnServ())
		dispatch(getDaysOfInterest(code))
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
	language: 'da',
	s: extend(loc['da'])
}
export const localization = (state = initialState, action) => {
	switch (action.type) {
		case NOSETTINGS:
			return Object.assign({}, state, {
				language: action.settings.language,
				s: extend(loc[action.settings.language])
			})
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
