/* eslint-disable eqeqeq */
import { set, get } from 'variables/storage'
import { getAllUsers, getUser } from 'variables/dataUsers'
import { getAllOrgs, getOrg } from 'variables/dataOrgs'

import { handleRequestSort } from 'variables/functions'
import { getSuggestions } from './globalSearch'
import { getAllRegistries, getRegistry, getAllMessages } from 'variables/dataRegistry'
import { getAllTokens } from 'variables/dataTokens'
import { getAllDeviceTypes, getDeviceType } from 'variables/dataDeviceTypes'
import { getAllSensors, getSensor } from 'variables/dataSensors'
import { getAllFunctions, getFunction } from 'variables/dataFunctions'
import { getPrivList, getPriv } from 'redux/auth'


//#region Special Functions
/**
 * Special functions
 */
const renderUserGroup = (user) => {
	if (user.groups) {
		if (user.groups[136550100000143])
			return "users.groups.superUser"
		if (user.groups[136550100000211])
			return "users.groups.accountManager"
		if (user.groups[136550100000225])
			return "users.groups.user"
	}
	return ''
}
const compare = (obj1, obj2) => {
	//Loop through properties in object 1
	if (obj1 === undefined || obj2 === undefined || obj1 === null || obj2 === null) {
		return false
	}
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false

		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!compare(obj1[p], obj2[p])) return false
				break
			//Compare function code
			case 'function':
				// eslint-disable-next-line eqeqeq
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false
				break
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false
		}
	}

	//Check object 2 for any extra properties
	// eslint-disable-next-line no-redeclare
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false
	}
	return true
}
//#endregion

//#region Actions
const sData = 'Sort Data'

//#region Messages
const setmessages = 'setMessages'
const gotmessages = 'gotMessages'
//#endregion

//#region Tokens
const settokens = 'setTokens'
const gottokens = 'gotTokens'
//#endregion

//#region Users
const gotUsers = 'GotUsers'
const gotUser = 'GotUser'
const setusers = 'SetUsers'
const setUser = 'SetUser'
//#endregion

//#region Orgs
const gotorgs = 'GotOrgs'
const gotOrg = 'GotOrg'
const setorgs = 'SetOrgs'
const setOrg = 'SetOrganisation'

//#endregion

//#region Devices
const gotdevices = 'GotDevices'
const gotDevice = 'GotDevice'
const setdevices = 'SetDevices'
const setDevice = 'SetDevice'

//#endregion

//#region Projects
const gotprojects = 'GotProjects'
const gotProject = 'GotProject'
const setprojects = 'SetProjects'
const setProject = 'SetProject'

//#endregion

//#region collections
const gotcollections = 'GotCollections'
const gotCollection = 'GotCollection'
const setcollections = 'SetCollections'
const setCollection = 'SetCollection'

//#endregion

//#region registries
const gotregistries = 'GotRegistries'
const gotRegistry = 'gotRegistry'
const setregistries = 'SetRegistries'
const setRegistry = 'setRegistry'

//#endregion

//#region deviceTypes
const setdeviceTypes = 'setdeviceTypes'
const gotDeviceType = 'gotDeviceType'
const gotdeviceTypes = 'gotdeviceTypes'
const setDeviceType = 'setDeviceType'

//#endregion

//#region Sensors
const setsensors = 'setsensors'
const gotSensor = 'gotSensor'
const gotsensors = 'gotsensors'
const setSensor = 'setSensor'

//#endregion

//#region Functions
const setFunction = 'setFunction'
const gotFunction = 'gotFunction'
const setfunctions = 'SetFunctions'
const gotfunctions = 'gotFunctions'

//#endregion


//#region Favorites
const getFavorites = 'getFavorites'
const setFavorites = 'setFavorites'

//#endregion

//#endregion

//#region Dispatches

export const getAllData = async (reload, orgId, su) => {
	return async dispatch => {
		await dispatch(await getUsers(true))
		dispatch(await getOrgs(true))
		dispatch(await getRegistries(true, orgId, su))
		dispatch(await getDeviceTypes(true, orgId, su))
		dispatch(await getSensors(true, orgId, su))
		dispatch(await getFunctions(true, orgId, su))
		// dispatch(await getTokens(true, orgId, su))
		// dispatch(await getMessages(orgId, true))
	}
}

export const sortData = (key, property, order) => {
	return (dispatch, getState) => {
		let data = getState().data[key]
		let sortedData = handleRequestSort(property, order, data)
		let newArr = []
		newArr = sortedData
		dispatch({
			type: sData,
			payload: {
				key,
				sortedData: newArr
			}
		})

	}
}

//#region Users

export const getUserLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotUser, payload: false })
		let user = get('user.' + id)
		if (user) {
			await dispatch(await getPrivList([id], ['user.modify', 'user.delete']))
			dispatch({
				type: setUser,
				payload: user
			})
			dispatch({
				type: gotUser,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotUser,
				payload: false,
			})
			dispatch({
				type: setUser,
				payload: null
			})
		}
		await getUser(id).then(async rs => {
			await dispatch(await getPrivList([id], ['user.modify', 'user.delete']))
			if (!compare(user, rs)) {
				if (rs)
					user = { ...rs }
				else
					user = undefined
				dispatch({
					type: setUser,
					payload: user
				})
				set('user.' + id, user)
				dispatch({
					type: gotUser,
					payload: true
				})
			}
		})
	}
}

export const getUsers = (reload) => {
	return async (dispatch, getState) => {

		await getAllUsers().then(async rs => {
			let users = rs.map(u => ({ ...u, group: renderUserGroup(u) }))
			users = handleRequestSort('firstName', 'asc', users)
			let userUUIDs = rs.map(u => u.uuid)
			let user = getState().settings.user
			await dispatch(await getPriv(user.uuid, ['user.create', 'user.list']))
			await dispatch(await getPrivList(userUUIDs, ['user.modify', 'user.delete, user.changeparent']))
			set('users', users)
			if (reload) {
				dispatch(setUsers())
			}
			dispatch({ type: gotUsers, payload: true })
		})
	}
}

export const setUsers = () => {
	return dispatch => {
		let users = get('users')

		if (users) {
			dispatch({
				type: setusers,
				payload: users
			})
			dispatch(getSuggestions())
			// dispatch(sortData('users', 'firstName', 'asc'))
		}
		else dispatch({
			type: gotUsers,
			payload: false
		})
	}
}

//#endregion

//#region Orgs
export const getOrgLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotOrg, payload: false })
		let org = get('org.' + id)
		if (org) {
			await dispatch(await getPrivList([id], ['org.modify', 'org.delete']))
			dispatch({
				type: setOrg,
				payload: org
			})
			dispatch({
				type: gotOrg,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotOrg,
				payload: false,
			})
			dispatch({
				type: setOrg,
				payload: null
			})
		}
		await getOrg(id).then(async rs => {
			await dispatch(await getPrivList([id], ['org.modify', 'org.delete']))
			if (!compare(org, rs)) {
				org = { ...rs }
				dispatch({
					type: setOrg,
					payload: org
				})
				set('org.' + id, org)
				dispatch({
					type: gotOrg,
					payload: true
				})
			}
		})
	}
}
export const getOrgs = (reload) => {
	return async (dispatch, getState) => {
		await getAllOrgs().then(async rs => {
			let orgs = handleRequestSort('name', 'asc', rs)
			let orgUUIDs = rs.map(u => u.uuid)
			let user = getState().settings.user
			await dispatch(await getPriv(user.uuid, ['org.create', 'org.list']))
			await dispatch(await getPrivList(orgUUIDs, ['org.modify', 'org.delete']))
			set('orgs', orgs)
			if (reload) {
				dispatch(setOrgs())
			}
			dispatch({ type: gotorgs, payload: true })
		})
	}
}
export const setOrgs = () => {
	return dispatch => {
		let orgs = get('orgs')
		if (orgs) {
			dispatch({
				type: setorgs,
				payload: orgs
			})
			dispatch(getSuggestions())
			// dispatch(sortData('orgs', 'name', 'asc'))
		}
		else {
			dispatch({ type: gotorgs, payload: false })
		}
	}
}
//#endregion

//#region Device Types
export const getDeviceTypeLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotDeviceType, payload: false })
		let deviceType = get('deviceType.' + id)
		if (deviceType) {
			await dispatch(await getPrivList([id], ['deviceType.modify', 'deviceType.delete']))
			dispatch({
				type: setDeviceType,
				payload: deviceType
			})
			dispatch({
				type: gotDeviceType,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotDeviceType,
				payload: false
			})
			dispatch({
				type: setDeviceType,
				payload: null
			})
		}
		await getDeviceType(id).then(async rs => {
			await dispatch(await getPrivList([id], ['deviceType.modify', 'deviceType.delete']))
			if (!compare(deviceType, rs)) {
				deviceType = {
					...rs,
				}
				dispatch({
					type: setDeviceType,
					payload: deviceType
				})
				set('deviceType.' + id, deviceType)
				dispatch({
					type: gotDeviceType,
					payload: true
				})
			}
		})
	}
}

export const getDeviceTypes = (reload, orgId, ua) => {
	return async (dispatch, getState) => {
		getAllDeviceTypes(orgId, ua).then(async rs => {
			let deviceTypes = handleRequestSort('id', 'asc', rs)
			let dtUUIDs = rs.map(u => u.uuid)
			let user = getState().settings.user
			await dispatch(await getPriv(user.uuid, ['deviceType.create', 'deviceType.list']))
			await dispatch(await getPrivList(dtUUIDs, ['deviceType.modify', 'deviceType.delete', 'deviceType.changeparent']))
			set('devicetypes', deviceTypes)
			if (reload) {
				dispatch(setDeviceTypes())
			}
			dispatch({ type: gotdeviceTypes, payload: true })
		})
	}
}

export const setDeviceTypes = () => {
	return dispatch => {
		let deviceTypes = get('devicetypes')
		if (deviceTypes) {
			dispatch({
				type: setdeviceTypes,
				payload: deviceTypes
			})
			dispatch(getSuggestions())
			// dispatch(sortData('collections', 'id', 'asc'))
		}
		else {
			dispatch({ type: gotdeviceTypes, payload: false })
		}
	}
}

//#endregion

//#region Fuctions
export const getFunctionLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotFunction, payload: false })
		let cloudfunction = get('cloudfunction.' + id)
		if (cloudfunction) {
			await dispatch(await getPrivList([id], ['cloudfunction.modify', 'cloudfunction.delete']))
			dispatch({
				type: setFunction,
				payload: cloudfunction
			})
			dispatch({
				type: gotFunction,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotFunction,
				payload: false
			})
			dispatch({
				type: setFunction,
				payload: null
			})
		}
		await getFunction(id).then(async rs => {
			await dispatch(await getPrivList([id], ['cloudfunction.modify', 'cloudfunction.delete']))
			if (!compare(cloudfunction, rs)) {
				cloudfunction = {
					...rs,
				}
				dispatch({
					type: setFunction,
					payload: cloudfunction
				})
				set('cloudfunction.' + id, cloudfunction)
				dispatch({
					type: gotFunction,
					payload: true
				})
			}
		})
	}
}
export const getFunctions = (reload, orgId, su) => {
	return async (dispatch, getState) => {
		getAllFunctions(orgId, su).then(async rs => {
			let functions = handleRequestSort('id', 'asc', rs)
			let funcUUIDs = rs.map(u => u.uuid)
			let user = getState().settings.user
			await dispatch(await getPriv(user.uuid, ['cloudfunction.create', 'cloudfunction.list']))
			await dispatch(await getPrivList(funcUUIDs, ['cloudfunction.modify', 'cloudfunction.delete, cloudfunction.changeparent']))
			set('functions', functions)
			if (reload) {
				dispatch(setFunctions())
			}
			dispatch({ type: gotfunctions, payload: true })
		})
	}
}
export const setFunctions = () => {
	return dispatch => {
		let functions = get('functions')
		if (functions) {
			dispatch({
				type: setfunctions,
				payload: functions
			})
			dispatch(getSuggestions())
			// dispatch(sortData('collections', 'id', 'asc'))
		}
		else {
			dispatch({ type: gotregistries, payload: false })
		}
	}
}

//#endregion

//#region Registries
export const getRegistryLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotRegistry, payload: false })
		let registry = get('registry.' + id)
		if (registry) {
			await dispatch(await getPrivList([id], ['registry.modify', 'registry.changeparent', 'registry.delete']))
			dispatch({
				type: setRegistry,
				payload: registry
			})
			dispatch({
				type: gotRegistry,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotRegistry,
				payload: false
			})
			dispatch({
				type: setRegistry,
				payload: null
			})
		}
		await getRegistry(id).then(async rs => {
			await dispatch(await getPrivList([id], ['registry.modify', 'registry.changeparent', 'registry.delete']))

			if (!compare(registry, rs)) {
				registry = {
					...rs,
				}
				dispatch({
					type: setRegistry,
					payload: registry
				})
				set('registry.' + id, registry)
				dispatch({
					type: gotRegistry,
					payload: true
				})
			}
		})
	}
}
export const getRegistries = (reload, orgId, su) => {
	return async (dispatch, getState) => {
		await getAllRegistries(orgId, su).then(async rs => {
			let registries = handleRequestSort('id', 'asc', rs)
			let regUUIDs = registries.map(r => r.uuid)
			let user = getState().settings.user
			await dispatch(await getPriv(user.uuid, ['registry.create', 'registry.list']))
			await dispatch(await getPrivList(regUUIDs, ['registry.modify', 'registry.delete']))
			set('registries', registries)
			if (reload) {
				dispatch(setRegistries())
			}
			dispatch({ type: gotregistries, payload: true })
		})
	}
}
export const setRegistries = () => {
	return dispatch => {
		let registries = get('registries')
		if (registries) {
			dispatch({
				type: setregistries,
				payload: registries
			})
			dispatch({ type: gotregistries, payload: true })
			dispatch(getSuggestions())
			// dispatch(sortData('collections', 'id', 'asc'))
		}
		else {
			dispatch({ type: gotregistries, payload: false })
		}
	}
}
//#endregion

//#region Sensors
export const unassignSensor = () => {
	return dispatch => {
		dispatch({ type: setSensor, payload: null })
		dispatch({ type: gotSensor, payload: false })
	}
}

export const getSensorLS = async (id, customerID, ua) => {
	return async dispatch => {

		dispatch({ type: gotSensor, payload: false })
		dispatch({
			type: setSensor,
			payload: null
		})
		let sensor = get('sensor.' + id)
		await dispatch(await getPrivList([id], ['device.modify', 'device.delete']))
		if (sensor) {
			if (sensor.uuid) {
				dispatch({
					type: setSensor,
					payload: sensor
				})
				dispatch({
					type: gotSensor,
					payload: true
				})
			}
			else {
				dispatch({
					type: gotSensor,
					payload: false
				})
				dispatch({
					type: setSensor,
					payload: null
				})
			}
		}
		else {
			dispatch({
				type: gotSensor,
				payload: false
			})
			dispatch({
				type: setSensor,
				payload: null
			})
		}
		await getSensor(id, customerID, ua).then(async rs => {
			await dispatch(await getPrivList([id], ['device.modify', 'device.delete']))

			if (!compare(sensor, rs)) {
				sensor = {
					...rs,
				}
				dispatch({
					type: setSensor,
					payload: sensor
				})
				set('sensor.' + id, sensor)
				dispatch({
					type: gotSensor,
					payload: true
				})
			}
		})
	}
}

export const getSensors = (reload, customerID, ua) => {
	return async (dispatch, getState) => {
		await getAllSensors(customerID, ua).then(async rs => {
			let sensors = handleRequestSort('id', 'asc', rs)
			set('sensors', sensors)
			let user = getState().settings.user
			let deviceUUIDs = rs.map(r => r.uuid)
			await dispatch(await getPriv(user.uuid, ['device.create', 'device.list']))
			await dispatch(await getPrivList(deviceUUIDs, ['device.modify', 'device.delete']))
			if (reload) {
				dispatch(setSensors())
			}
			dispatch({ type: gotsensors, payload: true })
		})
	}
}

export const setSensors = () => {
	return dispatch => {
		let sensors = get('sensors')
		if (sensors) {
			dispatch({
				type: setsensors,
				payload: sensors
			})
			dispatch(getSuggestions())
			// dispatch(sortData('collections', 'id', 'asc'))
		}
		else {
			dispatch({ type: gotsensors, payload: false })
		}
	}
}

//#endregion

//#region Tokens
export const getTokens = (userId, reload) => {
	return dispatch => {
		getAllTokens(userId).then(rs => {
			let tokens = handleRequestSort('title', 'asc', rs)
			set('tokens', tokens)
			if (reload) {
				dispatch(setTokens())
			}
			dispatch({ type: gottokens, payload: true })
		})

	}
}

export const setTokens = () => {
	return dispatch => {
		let tokens = get('tokens')
		if (tokens) {
			dispatch({
				type: settokens,
				payload: tokens
			})
			dispatch(getSuggestions())
		}
		else {
			dispatch({ type: gottokens, payload: false })
		}
	}
}
//#endregion

//#region Messages
export const getMessages = (customerID, reload, ua) => {
	return dispatch => {

		getAllMessages(ua ? undefined : customerID).then(rs => {
			// let messages = handleRequestSort('title', 'asc', rs)
			// set('messages', messages)
			if (reload) {
				dispatch(setMessages(rs))
			}
			dispatch({ type: gotmessages, payload: true })
		})

	}
}

export const setMessages = (messages) => {
	return dispatch => {
		// let messages = get('messages')
		if (messages) {
			dispatch({
				type: setmessages,
				payload: messages
			})
			dispatch(getSuggestions())
		}
		else {
			dispatch({ type: gotmessages, payload: false })
		}
	}
}
//#endregion

//#endregion

const initialState = {
	tokens: [],
	messages: [],
	favorites: [],
	users: [],
	orgs: [],
	devices: [],
	projects: [],
	collections: [],
	registries: [],
	sensors: [],
	deviceTypes: [],
	functions: [],
	gotusers: false,
	gotorgs: false,
	gotdevices: false,
	gotprojects: false,
	gotcollections: false,
	gotregistries: false,
}

export const data = (state = initialState, { type, payload }) => {
	switch (type) {
		//#region Special
		case sData:
			return Object.assign({}, state, { [payload.key]: payload.sortedData })
		case getFavorites:
			return Object.assign({}, state, { favorites: payload })
		case setFavorites:
			return Object.assign({}, state, { favorites: payload })
		//#endregion
		//#region Tokens
		case settokens:
			return Object.assign({}, state, { tokens: payload })
		case gottokens:
			return Object.assign({}, state, { gottokens: payload })
		//#endregion
		//#region Messages
		case setmessages:
			return Object.assign({}, state, { messages: payload })
		case gotmessages:
			return Object.assign({}, state, { gotmessages: payload })
		//#endregion
		//#region Device Types
		case setDeviceType:
			return Object.assign({}, state, { deviceType: payload })
		case gotDeviceType:
			return Object.assign({}, state, { gotDeviceType: payload })
		case gotdeviceTypes:
			return Object.assign({}, state, { gotdeviceTypes: payload })
		case setdeviceTypes:
			return Object.assign({}, state, { deviceTypes: payload })
		//#endregion
		//#region Registries
		case gotregistries:
			return Object.assign({}, state, { gotregistries: payload })
		case setRegistry:
			return Object.assign({}, state, { registry: payload })
		case gotRegistry:
			return Object.assign({}, state, { gotRegistry: payload })
		case setregistries:
			return Object.assign({}, state, { registries: payload })

		//#endregion
		//#region Sensors
		case setSensor:
			return Object.assign({}, state, { sensor: payload })
		case gotSensor:
			return Object.assign({}, state, { gotSensor: payload })
		case setsensors:
			return Object.assign({}, state, { sensors: payload })
		case gotsensors:
			return Object.assign({}, state, { gotsensors: payload })
		//#endregion
		//#region Collections
		case setCollection:
			return Object.assign({}, state, { collection: payload })
		case gotCollection:
			return Object.assign({}, state, { gotCollection: payload })
		case gotcollections:
			return Object.assign({}, state, { gotcollections: payload })
		case setcollections:
			return Object.assign({}, state, { collections: payload })
		//#endregion
		//#region Devices
		case setDevice:
			return Object.assign({}, state, { device: payload })
		case gotDevice:
			return Object.assign({}, state, { gotDevice: payload })
		case gotdevices:
			return Object.assign({}, state, { gotdevices: payload })
		case setdevices:
			return Object.assign({}, state, { devices: payload })
		//#endregion
		//#region Orgs
		case setOrg:
			return Object.assign({}, state, { org: payload })
		case gotOrg:
			return Object.assign({}, state, { gotOrg: payload })
		case gotorgs:
			return Object.assign({}, state, { gotorgs: payload })
		case setorgs:
			return Object.assign({}, state, { orgs: payload })
		//#endregion
		//#region Users
		case setUser:
			return Object.assign({}, state, { user: payload })
		case gotUser:
			return Object.assign({}, state, { gotUser: payload })
		case gotUsers:
			return Object.assign({}, state, { gotusers: payload })
		case setusers:
			return Object.assign({}, state, { users: payload })
		//#endregion
		//#region Projects
		case gotprojects:
			return Object.assign({}, state, { gotprojects: payload })
		case setProject:
			return Object.assign({}, state, { project: payload })
		case gotProject:
			return Object.assign({}, state, { gotProject: payload })
		case setprojects:
			return Object.assign({}, state, { projects: payload })
		//#endregion
		//#region Functions
		case setFunction:
			return Object.assign({}, state, { cloudfunction: payload })
		case gotFunction:
			return Object.assign({}, state, { gotFunction: payload })
		case gotfunctions:
			return Object.assign({}, state, { gotfunctions: payload })
		case setfunctions:
			return Object.assign({}, state, { functions: payload })
		//#endregion
		default:
			return state
	}
}
