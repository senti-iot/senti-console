import cookie from 'react-cookies';
import { getUser, getValidSession } from 'variables/dataUsers'
// import moment from 'moment'
import 'moment/locale/da'
import 'moment/locale/en-gb'
import { saveSettings } from 'variables/dataLogin';
var moment = require('moment')

//Display
const MENULOC = 'sidebarLocation'
const changeLangAction = 'changeLanguage'
const THEME = 'theme'
const TRP = 'tableRowsPerPage'
const DISCSENT = 'discoverSentiBanner'
const DIDKNOW = 'notifDidYouKnow'

//Calibration
const CALTYPE = 'calibrationType'
const COUNT = 'calibrationCount'
const TCOUNT = 'calibrationTimeCount'
const CALNOTIF = 'calibrationNotify'
const ALERTS = 'notifAlerts'
const GETFAVS = 'getFavorites'

//Charts
const CHARTTYPE = 'chartType'
const CHARTDATATYPE = 'chartDataType'

//Get/Set Settings from server
const GETSETTINGS = 'getSettings'
const SAVESETTINGS = 'saveSettings'
const SAVED = 'savedSettings'
const NOSETTINGS = 'noSettings'

export const saveSettingsOnServ = () => {
	return async (dispatch, getState) => {
		let user = getState().settings.user
		let s = getState().settings
		let settings = {
			calibration: s.calibration,
			calNotifications: s.calNotifications,
			count: s.count,
			tcount: s.tcount,
			chartType: s.chartType,
			discSentiVal: s.discSentiVal,
			sideBar: s.sideBar,
			theme: s.theme,
			trp: s.trp,
			alerts: s.alerts,
			didKnow: s.didKnow,
			rawData: s.rawData
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
		var sessionCookie = cookie.load('SESSION') ? cookie.load('SESSION') : null
		if (sessionCookie)
		{
			let vSession = await getValidSession(sessionCookie.userID).then(rs => rs.status)
			if (vSession === 200) {
				let exp = moment().add('1', 'day')
				cookie.save('SESSION', sessionCookie, { path: '/', expires: exp.toDate() })
			}
			else {
				return cookie.remove('SESSION')
			}
		}

		var userId = cookie.load('SESSION') ? cookie.load('SESSION').userID : 0
		var user = userId !== 0 ? await getUser(userId) : null
		var settings = user ? user.aux ? user.aux.senti ? user.aux.senti.settings ? user.aux.senti.settings : null : null : null : null
		var favorites = user ? user.aux ? user.aux.senti ? user.aux.senti.favorites ? user.aux.senti.favorites : null : null : null : null
		moment.updateLocale('en-gb', {
			week: {
				dow: 1
			}
		})
		if (user) {
			if (settings) {
				moment.locale(user.aux.odeum.language === 'en' ? 'en-gb' : user.aux.odeum.language)
				dispatch({
					type: GETSETTINGS,
					settings: {
						...user.aux.senti.settings,
						language: user.aux.odeum.language
					},
					user
				})
			}
		
			else {
				moment.locale(user.aux.odeum.language === 'en' ? 'en-gb' : user.aux.odeum.language)
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
			}
			if (favorites) { 
				dispatch({
					type: GETFAVS,
					favorites: {
						favorites: favorites
					}
				})
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
export const changeChartDataType = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: CHARTDATATYPE,
			t
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeChartType = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: CHARTTYPE,
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
export const changeTCount = tcount => {
	return async (dispatch, getState) => {
		dispatch({
			type: TCOUNT,
			tcount
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
	rawData: 0,
	language: 'dk',
	calibration: 1,
	calNotifications: 0,
	count: 200,
	tcount: 600,
	discSentiVal: 1,
	sideBar: 0,
	theme: 0,
	chartType: 3,
	trp: 10,
	alerts: 1,
	didKnow: 0,
	loading: true,
	saved: false,
	rowsPerPageOptions: [ 5, 10, 15, 20, 25, 50, 100 ]
}
export const settings = (state = initialState, action) => {
	switch (action.type) {
		case CHARTDATATYPE: 
			return Object.assign({}, state, { rawData: action.t })
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
		case TCOUNT:
			return Object.assign({}, state, {
				tcount: action.tcount
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
		case CHARTTYPE: 
			return Object.assign({}, state, {
				chartType: action.t
			})
		default:
			return state
	}

}