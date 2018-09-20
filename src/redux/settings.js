import { getSettingsFromServer, saveSettingsOnServer } from 'variables/dataLogin';
import cookie from 'react-cookies';
import { getUser } from '../variables/dataUsers'
// import moment from 'moment'
import 'moment/locale/da'
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

export const saveSettingsOnServ = () => {
	return async (dispatch, getState) => {
		let s = getState().settings
		let settings = {
			language: s.language,
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
		var saved = await saveSettingsOnServer(settings);
		dispatch({
			type: SAVESETTINGS,
			saved
		})
	}
}
export const getSettings = async () => {
	return async dispatch => {
		var userId = cookie.load('SESSION') ? cookie.load('SESSION').userID : 0
		var settings = userId > 0 ? await getSettingsFromServer() : null
		var user = userId !== 0 ? await getUser(userId) : {}
		moment.updateLocale("en", {
			week: {
				dow: 1
			}
		})
		if (settings) {
			moment.locale(settings.language)
			dispatch({
				type: GETSETTINGS,
				settings,
				user
			})
			return true
		}
		else {
			moment.locale("da")
			dispatch({
				type: "NOSETTINGS",
				loading: false,
				user
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


}
export const settings = (state = initialState, action) => {
	switch (action.type) {

		case SAVED:
			return Object.assign({}, state, { saved: action.saved })
		case DISCSENT:
			return Object.assign({}, state, { discSentiVal: action.val })
		case "NOSETTINGS":
			return Object.assign({}, state, { loading: false, user: action.user })
		case GETSETTINGS:
			return Object.assign({}, state, { ...action.settings, user: action.user, loading: false })
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