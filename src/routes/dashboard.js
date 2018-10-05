import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from "views/Dashboard/Dashboard";
import { Dashboard, LibraryBooks, Devices as DeviceIco, SettingsRounded, People } from "variables/icons";
import NotFound from "layouts/404/NotFound";
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';
import { DataUsage } from 'variables/icons';

const AsyncCollections = Loadable({
	loader: () => import('./collections'),
	loading: AsyncLoader
})
const AsyncProjects = Loadable({
	loader: () => import("./projects"),
	loading: AsyncLoader
});
const AsyncProject  = Loadable({
	loader: () => import("./project"),
	loading: AsyncLoader
})
const AsyncDevices  = Loadable({
	loader: () => import("./devices"),
	loading: AsyncLoader
})
const AsyncDevice = Loadable({
	loader: () => import("./device"),
	loading: AsyncLoader
})
const AsyncUsers  = Loadable({
	loader: () => import("./users"),
	loading: AsyncLoader
})
const AsyncUser  = Loadable({
	loader: () => import("./user"),
	loading: AsyncLoader
})
const AsyncOrgs = Loadable({
	loader: () => import("./orgs"),
	loading: AsyncLoader
})
const AsyncOrg = Loadable({
	loader: () => import("./org"),
	loading: AsyncLoader
})
const AsyncSettings = Loadable({
	loader: () => import("../views/Settings/Settings"),
	loading: AsyncLoader
})
const dashboardRoutes = [
	{
		path: "/dashboard",
		sidebarName: "sidebar.dashboard",
		navbarName: "Senti Dashboard",
		icon: Dashboard,
		component: DashboardPage,
		menuRoute: "dashboard"
	},
	{
		path: "/project/:id",
		component: AsyncProject,
		hideFromSideBar: true,
		menuRoute: "projects"
	},
	{
		path: "/projects",
		sidebarName: "sidebar.projects",
		icon: LibraryBooks,
		component: AsyncProjects,
		menuRoute: "projects"
	},
	{
		path: "/collections",
		sidebarName: "sidebar.collections",
		component: AsyncCollections,
		icon: DataUsage,
		menuRoute: "collections"
	},
	{
		path: "/device/:id",
		component: AsyncDevice,
		hideFromSideBar: true,
		menuRoute: "devices"
	},
	{
		path: "/devices",
		sidebarName: "sidebar.devices",
		icon: DeviceIco,
		component: AsyncDevices,
		menuRoute: "devices"
	},
	{
		path: "/users",
		sidebarName: "sidebar.users",
		icon: People,
		component: AsyncUsers,
		menuRoute: "users"
	},
	{
		path: "/user/:id",
		component: AsyncUser,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/orgs",
		component: AsyncOrgs,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/org/:id",
		component: AsyncOrg,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/settings",
		sidebarName: "sidebar.settings",
		icon: SettingsRounded,
		component: AsyncSettings,
		menuRoute: "settings"
	},
	{
		path: "/404",
		sidebarName: "Error",
		component: NotFound,
		hideFromSideBar: true,
	},
	{
		path: "*",
		component: () => <Redirect from={window.location.pathname} to={window.location.pathname === '/' ? '/dashboard' : '/404'} />,
		hideFromSideBar: true
	},


];

export default dashboardRoutes;
