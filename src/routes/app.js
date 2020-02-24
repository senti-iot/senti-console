import React from 'react'
import { Redirect } from 'react-router-dom'
import {
	Dashboard, LibraryBooks, SettingsApplications,
	SettingsRounded, People, DeviceHub, Star, InputIcon, Memory, CloudUpload, /* InsertChart, */ Https
} from 'variables/icons'
import NotFound from 'layouts/404/NotFound'
import { DataUsage } from 'variables/icons'

/**
 * Sensors
 */
const AsyncSensor = React.lazy(() => import('routes/sensor'))
const AsyncSensors = React.lazy(() => import('routes/sensors'))

/**
 * API Tokens
 */
const AsyncTokens = React.lazy(() => import('routes/tokens'))

/**
 * Messages
 */
// const AsyncMessages = React.lazy(() => import('routes/messages'))

/**
 * Cloud functions
 */
const AsyncCloudFunction = React.lazy(() => import('routes/cloudfunction'))
const AsyncCloudFunctions = React.lazy(() => import('routes/cloudfunctions'))

/**
 * Device Types
 */
const AsyncDeviceType = React.lazy(() => import('routes/deviceType'))
const AsyncDeviceTypes = React.lazy(() => import('routes/deviceTypes'))

/**
 * Registries
 */
const AsyncRegistry = React.lazy(() => import('routes/registry'))
const AsyncRegistries = React.lazy(() => import('routes/registries'))

/**
 * Users, Orgs
 */
const AsyncManagement = React.lazy(() => import('views/Management/Management'))
const AsyncUsers = React.lazy(() => import('routes/users'))
const AsyncUser = React.lazy(() => import('routes/user'))
const AsyncOrgs = React.lazy(() => import('routes/orgs'))
const AsyncOrg = React.lazy(() => import('routes/org'))

/**
 * Favorites, Settings, Dashboard
 */
const AsyncFavorites = React.lazy(() => import('routes/favorites'))
const AsyncSettings = React.lazy(() => import('routes/settings'))
const AsyncDashboard = React.lazy(() => import('routes/dashboard'))
/**
 * SentiWi
 */
const AsyncCollection = React.lazy(() => import('routes/collection'))
const AsyncCollections = React.lazy(() => import('routes/collections'))
const AsyncProjects = React.lazy(() => import('routes/projects'))
const AsyncProject = React.lazy(() => import('routes/project'))
const AsyncDevices = React.lazy(() => import('routes/devices'))
const AsyncDevice = React.lazy(() => import('routes/device'))



const appRoutes = [
	{
		path: '/dashboard',
		sidebarName: 'sidebar.dashboard',
		navbarName: 'Senti Dashboard',
		icon: Dashboard,
		component: AsyncDashboard,
		menuRoute: 'dashboard'
	},
	{
		path: '/favorites',
		sidebarName: 'sidebar.favorites',
		icon: Star,
		component: AsyncFavorites,
		menuRoute: 'favorites'
	},

	{
		path: '/project/:id',
		component: AsyncProject,
		hideFromSideBar: true,
		menuRoute: 'projects'
	},

	{
		path: '/collection/:id',
		component: AsyncCollection,
		hideFromSideBar: true,
		menuRoute: 'collections'
	},

	{
		path: '/device/:id',
		component: AsyncDevice,
		hideFromSideBar: true,
		menuRoute: 'devices'
	},
	{
		path: '/registry/:id',
		component: AsyncRegistry,
		hideFromSideBar: true,
		menuRoute: 'manage.registries'
	},
	{
		path: '/sensor/:id',
		component: AsyncSensor,
		hideFromSideBar: true,
		menuRoute: 'manage.devices'
	},
	{
		path: '/devicetype/:id',
		component: AsyncDeviceType,
		hideFromSideBar: true,
		menuRoute: 'manage.devicetypes'
	},
	{
		divider: true,
	},
	{
		path: '/registries',
		icon: InputIcon,
		component: AsyncRegistries,
		sidebarName: 'sidebar.registries',
		menuRoute: 'manage.registries'
	},
	{
		path: '/devicetypes',
		icon: Memory,
		component: AsyncDeviceTypes,
		sidebarName: 'sidebar.devicetypes',
		menuRoute: 'manage.devicetypes'
	},
	{
		path: '/sensors',
		icon: DeviceHub,
		component: AsyncSensors,
		sidebarName: 'sidebar.devices',
		menuRoute: 'manage.sensors'
	},
	// {
	// 	divider: true,
	// },
	// {
	// 	path: '/messages',
	// 	sidebarName: 'sidebar.messages',
	// 	icon: InsertChart,
	// 	component: AsyncMessages,
	// 	menuRoute: 'messages'
	// },
	{
		divider: true,
	},
	{
		path: '/functions',
		icon: CloudUpload,
		component: AsyncCloudFunctions,
		sidebarName: 'sidebar.cloudfunctions',
		menuRoute: 'manage.cloudfunctions'
	},
	{
		path: '/api',
		icon: Https,
		component: AsyncTokens,
		sidebarName: 'sidebar.api',
		menuRoute: 'manage.api'
	},
	{
		divider: true,
	},
	{
		path: '/management/user/:id',
		component: AsyncUser,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/management/org/:id',
		component: AsyncOrg,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/management',
		sidebarName: 'sidebar.users',
		icon: People,
		component: AsyncManagement,
		menuRoute: 'users',
	},
	{
		path: '/users',
		sidebarName: 'sidebar.users',
		icon: People,
		hideFromSideBar: true,
		component: AsyncUsers,
		menuRoute: 'users'
	},
	{
		path: '/orgs',
		component: AsyncOrgs,
		hideFromSideBar: true,
		menuRoute: 'users'
	},

	{
		path: '/settings',
		sidebarName: 'sidebar.settings',
		icon: SettingsRounded,
		// hideFromSideBar: true,
		component: AsyncSettings,
		menuRoute: 'settings'
	},
	{
		path: '/404',
		sidebarName: 'Error',
		component: NotFound,
		hideFromSideBar: true,
	},
	{
		path: '/index:ext',
		hideFromSideBar: true,
		component: () => <Redirect to={'/dashboard'} />
	},
	{
		path: '/function/:id',
		hideFromSideBar: true,
		component: AsyncCloudFunction
	},
	{
		path: null,
		icon: SettingsApplications,
		sidebarName: 'sidebar.legacy',
		dropdown: true,
		menuRoute: 'legacy',
		items: [
			{
				path: '/devices',
				sidebarName: 'sidebar.devices',
				icon: DeviceHub,
				component: AsyncDevices,
				menuRoute: 'devices',
				defaultView: true,
			},
			{
				path: '/projects',
				sidebarName: 'sidebar.projects',
				icon: LibraryBooks,
				component: AsyncProjects,
				menuRoute: 'projects',
				defaultView: true,
			},
			{
				path: '/collections',
				sidebarName: 'sidebar.collections',
				component: AsyncCollections,
				icon: DataUsage,
				menuRoute: 'collections',
				defaultView: true,
			},
		]
	},
	{
		path: '*',
		component: () => <Redirect from={window.location.pathname} to={{ pathname: window.location.pathname === '/' ? '/dashboard' : '/404', prevURL: window.location.pathname }} />,
		hideFromSideBar: true
	},
]

export default appRoutes
