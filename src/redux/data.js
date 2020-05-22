/* eslint-disable eqeqeq */
import { set, get } from 'variables/storage'
import { getAllUsers, getUser } from 'variables/dataUsers'
import { getAllProjects, getProject } from 'variables/dataProjects'
import { getAllDevices, getDevice } from 'variables/dataDevices'
import { getAllOrgs, getOrg } from 'variables/dataOrgs'
import { getAllCollections, getCollection } from 'variables/dataCollections'
import { colors } from 'variables/colors'
import { hist } from 'Providers'
import { handleRequestSort } from 'variables/functions'
import { getSuggestions } from './globalSearch'
import { getAllRegistries, getRegistry, getAllMessages, getAllTokens } from 'variables/dataRegistry'
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
		// dispatch(await getProjects(true))
		// dispatch(await getCollections(true))
		// dispatch(await getDevices(true))
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
			await dispatch(await getPrivList(userUUIDs, ['user.modify', 'user.delete']))
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

//#region Devices
export const getDeviceLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotDevice, payload: false })
		let device = get('device.' + id)
		if (device) {
			dispatch({
				type: setDevice,
				payload: device
			})
			dispatch({
				type: gotDevice,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotDevice,
				payload: false,
			})
			dispatch({
				type: setDevice,
				payload: null
			})
		}
		await getDevice(id).then(async rs => {
			if (!compare(device, rs)) {
				let collection = await getCollection(rs.dataCollection)
				device = { ...rs, dataCollection: collection }
				dispatch({
					type: setDevice,
					payload: device
				})
				set('device.' + id, device)
				dispatch({
					type: gotDevice,
					payload: true
				})
			}
		})
	}
}
export const getDevices = (reload) => {
	return dispatch => {
		getAllDevices().then(rs => {
			let devices = handleRequestSort('id', 'asc', rs)
			set('devices', devices)
			if (reload) {
				dispatch(setDevices())
			}
			dispatch({ type: gotdevices, payload: true })
		})
	}
}
export const setDevices = () => {
	return dispatch => {
		let devices = get('devices')
		if (devices) {
			dispatch({
				type: setdevices,
				payload: devices
			})
			dispatch(getSuggestions())

			// dispatch(sortData('devices', 'name', 'asc'))
		}
		else {
			dispatch({ type: gotdevices, payload: false })
		}
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
	return dispatch => {
		getAllDeviceTypes(orgId, ua).then(rs => {
			let deviceTypes = handleRequestSort('id', 'asc', rs)
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
export const getFunctionLS = async (id, customerID, ua) => {
	return async dispatch => {
		dispatch({ type: gotFunction, payload: false })
		let cloudfunction = get('cloudfunction.' + id)
		if (cloudfunction) {
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
		await getFunction(id, customerID, ua).then(async rs => {
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
	return dispatch => {
		getAllFunctions(orgId, su).then(rs => {
			let functions = handleRequestSort('id', 'asc', rs)
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
export const getRegistryLS = async (id, customerID, ua) => {
	return async dispatch => {
		dispatch({ type: gotRegistry, payload: false })
		let registry = get('registry.' + id)
		if (registry) {
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
		await getRegistry(id, customerID, ua).then(async rs => {
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
	return dispatch => {
		getAllRegistries(orgId, su).then(rs => {
			let registries = handleRequestSort('id', 'asc', rs)
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
		if (sensor) {
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
		await getSensor(id, customerID, ua).then(async rs => {
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
	return dispatch => {
		getAllSensors(customerID, ua).then(rs => {
			let sensors = handleRequestSort('id', 'asc', rs)
			set('sensors', sensors)
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

//#region Collections
export const getCollectionLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotCollection, payload: false })
		let collection = get('collection.' + id)
		if (collection) {
			dispatch({
				type: setCollection,
				payload: collection
			})
			dispatch({
				type: gotCollection,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotCollection,
				payload: false
			})
			dispatch({
				type: setCollection,
				payload: null
			})
		}
		await getCollection(id).then(async rs => {
			if (!compare(collection, rs)) {
				let device, project
				if (rs.project.id) {
					project = await getProject(rs.project.id)
				}
				if (rs.activeDeviceStats) {
					device = await getDevice(rs.activeDeviceStats.id)
				}
				collection = {
					...rs,
					activeDevice: device,
					project: project
				}
				dispatch({
					type: setCollection,
					payload: collection
				})
				set('collection.' + id, collection)
				dispatch({
					type: gotCollection,
					payload: true
				})
			}
		})
	}
}

export const getCollections = (reload) => {
	return dispatch => {
		getAllCollections().then(rs => {
			let collections = handleRequestSort('id', 'asc', rs)
			set('collections', collections)
			if (reload) {
				dispatch(setCollections())
			}
			dispatch({ type: gotcollections, payload: true })
		})
	}
}

export const setCollections = () => {
	return dispatch => {
		let collections = get('collections')
		if (collections) {
			dispatch({
				type: setcollections,
				payload: collections
			})
			dispatch(getSuggestions())
			// dispatch(sortData('collections', 'id', 'asc'))
		}
		else {
			dispatch({ type: gotcollections, payload: false })
		}
	}
}

//#endregion

//#region Projects

export const getProjectLS = async (id) => {
	return async dispatch => {
		dispatch({ type: gotProject, payload: false })
		let project = get('project.' + id)
		if (project) {
			dispatch({
				type: setProject,
				payload: project
			})
			dispatch({
				type: gotProject,
				payload: true
			})
		}
		else {
			dispatch({
				type: gotProject,
				payload: false
			})
			dispatch({
				type: setProject,
				payload: null
			})
		}
		await getProject(id).then(rs => {
			if (rs) {
				if (!compare(project, rs)) {
					project = {
						...rs,
						dataCollections: rs.dataCollections.map((dc, i) => {
							return ({ ...dc, color: colors[i] })
						}),
						devices: rs.dataCollections.filter(dc => dc.activeDevice ? true : false).map((dc, i) => dc.activeDevice ? { ...dc.activeDevice, color: colors[i] } : null)
					}
					dispatch({
						type: setProject,
						payload: project
					})
					set('project.' + id, project)
					dispatch({
						type: gotProject,
						payload: true
					})
				}
			}
			else {
				hist.push('/404')
			}
		})

	}
}

export const getProjects = (reload) => {
	return dispatch => {
		getAllProjects().then(rs => {
			let projects = handleRequestSort('title', 'asc', rs)
			set('projects', projects)
			if (reload) {
				dispatch(setProjects())
			}
			dispatch({ type: gotprojects, payload: true })
		})

	}
}

export const setProjects = () => {
	return dispatch => {
		let projects = get('projects')
		if (projects) {
			dispatch({
				type: setprojects,
				payload: projects
			})
			dispatch(getSuggestions())
			// dispatch(sortData('projects', 'title', 'asc'))
		}
		else {
			dispatch({ type: gotprojects, payload: false })
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
