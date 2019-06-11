import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from 'views/Dashboard/Dashboard';
import { Dashboard, LibraryBooks, SettingsApplications, SettingsRounded, People, DeviceHub, Star, InputIcon, Memory, CloudUpload, InsertChart } from 'variables/icons';
import NotFound from 'layouts/404/NotFound';
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';
import { DataUsage } from 'variables/icons';

// const AsyncHoliday = Loadable({
// 	loader: () => import('routes/holiday'),
// 	loading: AsyncLoader
// })
const AsyncMessages = Loadable({
	loader: () => import('routes/messages'),
	loading: AsyncLoader
})
const AsyncCloudFunction = Loadable({
	loader: () => import('routes/cloudfunction'),
	loading: AsyncLoader
})
const AsyncCloudFunctions = Loadable({
	loader: () => import('routes/cloudfunctions'),
	loading: AsyncLoader
})
const AsyncSensors = Loadable({
	loader: () => import('routes/sensors'),
	loading: AsyncLoader
})
const AsyncSensor = Loadable({
	loader: () => import('routes/sensor'),
	loading: AsyncLoader
})
const AsyncDeviceType = Loadable({
	loader: () => import('routes/deviceType'),
	loading: AsyncLoader
})
const AsyncDeviceTypes = Loadable({
	loader: () => import('routes/deviceTypes'),
	loading: AsyncLoader
})
const AsyncRegistry = Loadable({
	loader: () => import('routes/registry'),
	loading: AsyncLoader
})
const AsyncRegistries = Loadable({
	loader: () => import('routes/registries'),
	loading: AsyncLoader
})
const AsyncManagement = Loadable({
	loader: () => import('views/Management/Management'),
	loading: AsyncLoader
})
const AsyncFavorites = Loadable({
	loader: () => import('routes/favorites'),
	loading: AsyncLoader
})
const AsyncCollection = Loadable({
	loader: () => import('routes/collection'),
	loading: AsyncLoader
})
const AsyncCollections = Loadable({
	loader: () => import('routes/collections'),
	loading: AsyncLoader
})
const AsyncProjects = Loadable({
	loader: () => import('routes/projects'),
	loading: AsyncLoader
});
const AsyncProject = Loadable({
	loader: () => import('routes/project'),
	loading: AsyncLoader
})
const AsyncDevices = Loadable({
	loader: () => import('routes/devices'),
	loading: AsyncLoader
})
const AsyncDevice = Loadable({
	loader: () => import('routes/device'),
	loading: AsyncLoader
})
const AsyncUsers = Loadable({
	loader: () => import('routes/users'),
	loading: AsyncLoader
})
const AsyncUser = Loadable({
	loader: () => import('routes/user'),
	loading: AsyncLoader
})
const AsyncOrgs = Loadable({
	loader: () => import('routes/orgs'),
	loading: AsyncLoader
})
const AsyncOrg = Loadable({
	loader: () => import('routes/org'),
	loading: AsyncLoader
})
const AsyncSettings = Loadable({
	loader: () => import('views/Settings/Settings'),
	loading: AsyncLoader
})
const dashboardRoutes = [
	{
		path: '/dashboard',
		sidebarName: 'sidebar.dashboard',
		navbarName: 'Senti Dashboard',
		icon: Dashboard,
		component: DashboardPage,
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
		path: '/projects',
		sidebarName: 'sidebar.projects',
		icon: LibraryBooks,
		component: AsyncProjects,
		menuRoute: 'projects',
		defaultView: true,
	},
	{
		path: '/collection/:id',
		component: AsyncCollection,
		hideFromSideBar: true,
		menuRoute: 'collections'
	},
	{
		path: '/collections',
		sidebarName: 'sidebar.collections',
		component: AsyncCollections,
		icon: DataUsage,
		menuRoute: 'collections',
		defaultView: true,
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
		path: '/devices',
		sidebarName: 'sidebar.devices',
		icon: DeviceHub,
		component: AsyncDevices,
		menuRoute: 'devices',
		defaultView: true,
	},
	{
		path: '/messages',
		sidebarName: 'sidebar.monitor',
		icon: InsertChart,
		component: AsyncMessages,
		menuRoute: 'messages'
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
		hideFromSideBar: true,
		component: AsyncSettings,
		menuRoute: 'settings'
	},
	// {
	// 	path: '/holiday',
	// 	sidebarName: "",
	// 	component: AsyncHoliday,
	// 	hideFromSideBar: true
	// },
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
		sidebarName: 'sidebar.manage',
		dropdown: true,
		menuRoute: 'manage',
		items: [
			{
				path: '/registries',
				icon: InputIcon,
				component: AsyncRegistries,
				sidebarName: 'sidebar.registries',
				menuRoute: 'manage.registries'
			},
			{
				path: '/sensors',
				icon: DeviceHub,
				component: AsyncSensors,
				sidebarName: 'sidebar.devices',
				menuRoute: 'manage.sensors'
			},
			{
				path: '/devicetypes',
				icon: Memory,
				component: AsyncDeviceTypes,
				sidebarName: 'sidebar.devicetypes',
				menuRoute: 'manage.devicetypes'
			},
			{
				path: '/functions',
				icon: CloudUpload,
				component: AsyncCloudFunctions,
				sidebarName: 'sidebar.cloudfunctions',
				menuRoute: 'manage.cloudfunctions'
			}
		]
	},
	{
		path: '*',
		component: () => <Redirect from={window.location.pathname} to={{ pathname: window.location.pathname === '/' ? '/dashboard' : '/404', prevURL: window.location.pathname }} />,
		hideFromSideBar: true
	},

];

export default dashboardRoutes;
