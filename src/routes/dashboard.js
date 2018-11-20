import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from 'views/Dashboard/Dashboard';
import { Dashboard, LibraryBooks, SettingsRounded, People, DeviceHub, Star } from 'variables/icons';
import NotFound from 'layouts/404/NotFound';
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';
import { DataUsage } from 'variables/icons';

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
const AsyncProject  = Loadable({
	loader: () => import('routes/project'),
	loading: AsyncLoader
})
const AsyncDevices  = Loadable({
	loader: () => import('routes/devices'),
	loading: AsyncLoader
})
const AsyncDevice = Loadable({
	loader: () => import('routes/device'),
	loading: AsyncLoader
})
const AsyncUsers  = Loadable({
	loader: () => import('routes/users'),
	loading: AsyncLoader
})
const AsyncUser  = Loadable({
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
		menuRoute: 'projects'
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
		menuRoute: 'collections'
	},
	{
		path: '/device/:id',
		component: AsyncDevice,
		hideFromSideBar: true,
		menuRoute: 'devices'
	},
	{
		path: '/devices',
		sidebarName: 'sidebar.devices',
		icon: DeviceHub,
		component: AsyncDevices,
		menuRoute: 'devices'
	},
	{
		path: '/users',
		sidebarName: 'sidebar.users',
		icon: People,
		component: AsyncUsers,
		menuRoute: 'users'
	},
	{
		path: '/user/:id',
		component: AsyncUser,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/orgs',
		component: AsyncOrgs,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/org/:id',
		component: AsyncOrg,
		hideFromSideBar: true,
		menuRoute: 'users'
	},
	{
		path: '/settings',
		sidebarName: 'sidebar.settings',
		icon: SettingsRounded,
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
		path: '*',
		component: () => <Redirect from={window.location.pathname} to={window.location.pathname === '/' ? '/dashboard' : '/404'} />,
		hideFromSideBar: true
	},


];

export default dashboardRoutes;
