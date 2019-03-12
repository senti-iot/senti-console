import cookie from 'react-cookies';
import { getUser, getValidSession } from 'variables/dataUsers'
import 'moment/locale/da'
import 'moment/locale/en-gb'
import { saveSettings } from 'variables/dataLogin';
import { setDates } from './dateTime';
var moment = require('moment')

const acceptCookies = 'acceptCookies'

//Display
const MENULOC = 'sidebarLocation'
const changeLangAction = 'changeLanguage'
const THEME = 'theme'
const TRP = 'tableRowsPerPage'
const DISCSENT = 'discoverSentiBanner'
const DidKnow = 'notifDidYouKnow'
const MapTheme = 'mapTheme'
const changeSB = 'changeSnackbarLocation'
const changeDP = 'changeDetailsPanelState'
const changeDT = 'changeDrawerType'
const changeDS = 'changeDrawerState'
const changeHB = 'changeHeaderBorder'
const changeBC = 'changeBreadCrumbs'
//Navigation

const changeDR = 'changeDefaultRoute'
const changeDV = 'changeDefaultView'
const changeDCON = 'changeDrawerCloseOnNav'

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
const addPeriod = 'chartAddPeriod'
const weekendColor = 'changeWeekendColor'

//Get/Set Settings from server

const GetSettings = 'getSettings'
const SAVESETTINGS = 'saveSettings'
const SAVED = 'savedSettings'
const NOSETTINGS = 'noSettings'
const reset = 'resetSettings'

export const resetSettings = () => {
	return async (dispatch, getState) => {
		dispatch({
			type: reset,
			user: getState().settings.user
		})
		dispatch(await saveSettingsOnServ())
		dispatch(await getSettings())
	}
}

export const saveSettingsOnServ = () => {
	return async (dispatch, getState) => {
		let user = getState().settings.user
		let s = getState().settings
		let settings = {
			weekendColor: s.weekendColor,
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
			rawData: s.rawData,
			mapTheme: s.mapTheme,
			defaultRoute: s.defaultRoute,
			cookies: s.cookies,
			periods: s.periods,
			snackbarLocation: s.snackbarLocation,
			detailsPanel: s.detailsPanel,
			drawer: s.drawer,
			drawerState: s.drawerState,
			drawerCloseOnNav: s.drawerCloseOnNav,
			headerBorder: s.headerBorder,
			breadcrumbs: s.breadcrumbs
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
		if (sessionCookie) {
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
					type: GetSettings,
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
export const changeSnackbarLocation = (val) => {
	return async dispatch => {
		dispatch({
			type: changeSB,
			snackbarLocation: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDrawerState = val => {
	return async dispatch => { 
		dispatch({
			type: changeDS,
			drawerState: val
		})
		dispatch(saveSettingsOnServ())

	}
}
export const changeDrawerType = (val) => {
	return async dispatch => {
		dispatch({
			type: changeDT,
			drawer: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDrawerCloseOnNav = (val) => { 
	return async  dispatch => { 
		dispatch({
			type: changeDCON,
			drawerCloseOnNav: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeHeaderBorder = (val) => {
	return async dispatch => { 
		dispatch({
			type: changeHB,
			headerBorder: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeBreadCrumbs = val => {
	return async dispatch => {
		dispatch({
			type: changeBC,
			breadcrumbs: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDetailsPanel = (val) => {
	return async dispatch => {
		dispatch({
			type: changeDP,
			detailsPanel: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const acceptCookiesFunc = (val) => {
	return async dispatch => {
		dispatch({
			type: acceptCookies,
			acceptCookies: val
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDefaultView = route => {
	return async (dispatch) => {
		dispatch({
			type: changeDV,
			defaultView: route
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeDefaultRoute = route => {
	return async (dispatch) => {
		dispatch({
			type: changeDR,
			defaultRoute: route
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeMapTheme = t => {
	return async (dispatch, getState) => {
		dispatch({
			type: MapTheme,
			t
		})
		dispatch(saveSettingsOnServ())
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
			type: DidKnow,
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
		let trp = nr
		if (nr === 'auto') {
			let height = window.innerHeight
			let rows = Math.round(height - 70 - 48 - 30 - 64 - 56 / 49)
			trp = rows
		}
		dispatch({
			type: TRP,
			nr: trp
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changeSettingsDate = (menuId, to, from, timeType, id) => {
	return async (dispatch, getState) => {
		let periods = []
		periods = [...getState().settings.periods]
		let c
		if (id === -1) {
			c = periods.length
		}
		else {
			c = periods.findIndex(f => f.id === id)
		}
		periods[c] = {
			id: c,
			menuId, to: to ? to : undefined, from: from ? from : undefined, timeType, chartType: id === -1 ? 3 : periods[c].chartType, hide: false, raw: id !== -1 ? periods[c].raw : false
		}
		dispatch({
			type: addPeriod,
			periods: periods
		})
		dispatch(saveSettingsOnServ())
	}
}
export const removeChartPeriod = pId => {
	return async (dispatch, getState) => {
		let periods = []
		periods = [...getState().settings.periods]
		periods.splice(periods.findIndex(f => f.id === pId), 1)
		dispatch({
			type: addPeriod,
			periods: periods
		})
		dispatch(saveSettingsOnServ())
	}
}
export const changePeriodChartType = (type, p) => { 
	return async (dispatch, getState) => { 
		let periods = []
		periods = [...getState().settings.periods]
		let id = periods.findIndex(f => f.id === p.id)
		if (id > -1) {
			periods[id].chartType = type
		}
		dispatch({
			type: addPeriod,
			periods
		})
		dispatch(saveSettingsOnServ())
	}
}

export const updateChartPeriod = p => {
	return async (dispatch, getState) => {
		let periods = []
		periods = [...getState().settings.periods]
		let id = periods.findIndex(f => f.id === p.id)
		if (id > -1) {
			periods[id].raw = !p.raw
		}
		dispatch({
			type: addPeriod,
			periods: periods
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
export const changeWeekendColor = (id) => { 
	return async (dispatch, getState) => { 
		dispatch({
			type: weekendColor,
			id
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
	weekendColor: 'red',
	periods: [{
		id: 0,
		menuId: 0,
		raw: true,
		timeType: 1,
		chartType: 3,
		hide: false
	}, {
		id: 1,
		menuId: 2,
		raw: false,
		timeType: 2,
		chartType: 3,
		hide: false
	}],
	cookies: true,
	defaultRoute: '/dashboard',
	defaultView: '/list',
	mapTheme: 0,
	rawData: 0,
	language: 'da',
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
	rowsPerPageOptions: ['auto', 5, 7, 8, 10, 15, 20, 25, 50, 100],
	cardsPerPageOptions: [2, 3, 4, 6, 8, 9],
	snackbarLocation: 'left',
	detailsPanel: 0,
	drawer: 'permanent',
	drawerState: true,
	drawerCloseOnNav: true,
	headerBorder: false,
	breadcrumbs: true,
}
export const settings = (state = initialState, action) => {
	switch (action.type) {
		case reset: 
			return Object.assign({}, state, { ...initialState, user: action.user, cookies: false })
		case changeBC: 
			return Object.assign({}, state, { breadcrumbs: action.breadcrumbs })
		case changeHB:
			return Object.assign({}, state, { headerBorder: action.headerBorder })
		case changeDCON: 
			return Object.assign({}, state, { drawerCloseOnNav: action.drawerCloseOnNav })
		case changeDS: 
			return Object.assign({}, state, { drawerState: action.drawerState })
		case changeDT: 
			return Object.assign({}, state, { drawer: action.drawer })
		case changeSB:
			return Object.assign({}, state, { snackbarLocation: action.snackbarLocation })
		case changeDP:
			return Object.assign({}, state, { detailsPanel: action.detailsPanel })
		case weekendColor:
			return Object.assign({}, state, { weekendColor: action.id })
		case addPeriod:
			let periods = setDates(action.periods)
			return Object.assign({}, state, { periods: periods })
		case acceptCookies:
			return Object.assign({}, state, { cookies: action.acceptCookies })
		case changeDR:
			return Object.assign({}, state, { defaultRoute: action.defaultRoute })
		case changeDV:
			return Object.assign({}, state, { defaultView: action.defaultView })
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
		case GetSettings:
		{
			let periods = setDates(action.settings.periods)
			return Object.assign({}, state, { ...action.settings, periods: periods, user: action.user, loading: false })
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
		case DidKnow:
			return Object.assign({}, state, {
				didKnow: action.t
			})
		case CHARTTYPE:
			return Object.assign({}, state, {
				chartType: action.t
			})
		case MapTheme:
			return Object.assign({}, state, {
				mapTheme: action.t
			})
		default:
			return state
	}

}