// import { getSettingsFromServer, saveSettingsOnServer } from 'variables/dataLogin';
import cookie from 'react-cookies';
import { getUser } from '../variables/dataUsers'
// import moment from 'moment'
import 'moment/locale/da'
import { saveSettings } from '../variables/dataLogin';
var moment = require("moment")
// import 'moment/locale/da'

const MENULOC = "SIDEBAR_LOCATION"
const THEME = "THEME"
const TRP = "TABLE_ROWS_PER_PAGE"
const CALTYPE = "CALIBRATION_TYPE"
const COUNT = "CALIBRATION_COUNT"
const CALNOTIF = "CALIBRATION_NOTIFICATION"
const DISCSENT = "DISCOVER_SENTI_PAGE"
const ALERTS = "NOTIFICATION_ALERTS"
const DIDKNOW = "NOTIFICATIOn_DIDYOUKNOW"
const GETSETTINGS = "GET_SETTINGS"
const SAVESETTINGS = "SAVE_SETTINGS"
const changeLangAction = "LANG"
const SAVED = "SAVED_SETTINGS"
const NOSETTINGS = "NO_SETTINGS"

export const saveSettingsOnServ = () => {
	return async (dispatch, getState) => {
		let user = getState().settings.user
		let s = getState().settings
		let settings = {
			calibration: s.calibration,
			calNotifications: s.calNotifications,
			count: s.count,
			discSentiVal: s.discSentiVal,
			sideBar: s.sideBar,
			theme: s.theme,
			trp: s.trp,
			alerts: s.alerts,
			didKnow: s.didKnow
		}
		user.aux = user.aux ? user.aux : {}
		user.aux.senti = user.aux.senti ? user.aux.senti : {}
		user.aux.senti.settings = settings
		user.aux.odeum.language = s.language
		var saved = await saveSettings(user);
		dispatch({
			type: SAVESETTINGS,
			saved: saved ? true : false
		})
	}
}
export const getSettings = async () => {
	return async (dispatch, getState) => {
		var userId = cookie.load('SESSION') ? cookie.load('SESSION').userID : 0
		var user = userId !== 0 ? await getUser(userId) : null
		var settings = user ? user.aux ? user.aux.senti ? user.aux.senti.settings ? user.aux.senti.settings : null : null : null : null
		moment.updateLocale("en", {
			week: {
				dow: 1
			}
		})
		if (user) {
			if (settings) {
				moment.locale(user.aux.odeum.language)
				dispatch({
					type: GETSETTINGS,
					settings: {
						...user.aux.senti.settings,
						language: user.aux.odeum.language
					},
					user
				})
				return true
			}
			else {
				moment.locale(user.aux.odeum.language)
				let s = {
					...getState().settings,
					language: user.aux.odeum.language
				}

				dispatch({
					type: NOSETTINGS,
					loading: false,
					user,
					settings: s
				})
				return false
			}
		}
		else {
			moment.locale('da')
			let s = {
				...getState().settings,
			}
			dispatch({
				type: NOSETTINGS,
				loading: false,
				user,
				settings: s
			})
			return false
		}
	}


}
export const changeAlerts = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: ALERTS,
			t
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDidKnow = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: DIDKNOW,
			t
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDiscoverSenti = val => {
	return async (dispatch, getState) => {
		dispatch({
			type: DISCSENT,
			val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeCalNotif = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: CALNOTIF,
			t
		})
		dispatch(saveSettingsOnServ())
	}
}

export const changeCount = count => {
	return async (dispatch, getState) => {
		dispatch({
			type: COUNT,
			count
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeCalType = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: CALTYPE,
			t
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeSideBarLoc = loc => {
	return async (dispatch, getState) => {
		dispatch({
			type: MENULOC,
			loc
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeTRP = (nr) => {
	return async (dispatch, getState) => {
		dispatch({
			type: TRP,
			nr
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeTheme = (code) => {
	return async (dispatch, getState) => {
		dispatch({
			type: THEME,
			code
		})
		dispatch(saveSettingsOnServ())
	}
}
export const finishedSaving = () => {
	return {
		type: SAVED,
		saved: false
	}
}
let initialState = {
	language: "dk",
	calibration: 1,
	calNotifications: 0,
	count: 200,
	discSentiVal: 1,
	sideBar: 0,
	theme: 0,
	trp: 10,
	alerts: 1,
	didKnow: 0,
	loading: true,
	saved: false,
	rowsPerPageOptions: [ 5, 10, 15, 20, 25, 50, 100 ]
}
export const settings = (state = initialState, action) => {
	switch (action.type) {

		case SAVED:
			return Object.assign({}, state, { saved: action.saved })
		case DISCSENT:
			return Object.assign({}, state, { discSentiVal: action.val })
		case NOSETTINGS:
		{
			return Object.assign({}, state, { ...action.settings, loading: false, user: action.user })
		}
		case GETSETTINGS:
		{
			return Object.assign({}, state, { ...action.settings, user: action.user, loading: false })
		}
		case changeLangAction:
		{
			moment.locale(action.code)
			return Object.assign({}, state, {
				language: action.code,
			})
		}
		case SAVESETTINGS:
			return Object.assign({}, state, {
				saved: action.saved
			})
		case THEME:
			return Object.assign({}, state, {
				theme: action.code
			})
		case TRP:
			return Object.assign({}, state, {
				trp: action.nr
			})
		case MENULOC:
			return Object.assign({}, state, {
				sideBar: action.loc
			})
		case CALTYPE:
			return Object.assign({}, state, {
				calibration: action.t
			})
		case COUNT:
			return Object.assign({}, state, {
				count: action.count
			})
		case CALNOTIF:
			return Object.assign({}, state, {
				calNotifications: action.t
			})
		case ALERTS:
			return Object.assign({}, state, {
				alerts: action.t
			})
		case DIDKNOW:
			return Object.assign({}, state, {
				didKnow: action.t
			})
		default:
			return state
	}

}