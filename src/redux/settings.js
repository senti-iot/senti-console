import { getSettingsFromServer, saveSettingsOnServer } from 'variables/dataLogin';

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
		var settings = await getSettingsFromServer()
		if (settings) {
			dispatch({
				type: GETSETTINGS,
				settings
			})
			return true
		}
		else {
			dispatch({
				type: "NOSETTINGS",
				loading: false
			})
			return false
		}
	}
}
export const changeAlerts = t => ({
	type: ALERTS,
	t
})
export const changeDidKnow = t => ({
	type: DIDKNOW,
	t
})
export const changeDiscoverSenti = val => ({
	type: DISCSENT,
	val
})
export const changeCalNotif = t => ({
	type: CALNOTIF,
	t
})

export const changeCount = count => ({
	type: COUNT,
	count
})
export const changeCalType = t => ({
	type: CALTYPE,
	t
})
export const changeSideBarLoc = loc => {
	return {
		type: MENULOC,
		loc
	}
}
export const changeTRP = (nr) => {
	return {
		type: TRP,
		nr
	}
}
export const changeTheme = (code) => {
	return {
		type: THEME,
		code
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

		case DISCSENT:
			return Object.assign({}, state, { discSentiVal: action.val })
		case "NOSETTINGS":
			return Object.assign({}, state, { loading: false })
		case GETSETTINGS:
			return Object.assign({}, state, { ...action.settings, loading: false })
		case changeLangAction:
			return Object.assign({}, state, {
				language: action.code,
			})
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