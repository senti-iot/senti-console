import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from "views/Dashboard/Dashboard";
// import UserProfile from "views/UserProfile/UserProfile.js";
// import Projects from "./projects";
// import ProjectRouting from './project'
// import Devices from './devices'
// import DeviceRouting from './device'
// import Users from './users'
// import UserRouting from './user'
// import OrgRouting from './org'
// import Orgs from './orgs'
// import Settings from 'views/Settings/Settings';
import { Dashboard, LibraryBooks, Devices as DeviceIco, SettingsRounded, People } from "@material-ui/icons";
import NotFound from "layouts/404/NotFound";
// import UserProfile from 'views/UserProfile/UserProfile';
import Loadable from 'react-loadable';
import AsyncLoader from 'components/Loader/AsyncLoader';

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
