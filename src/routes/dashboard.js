import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from "views/Dashboard/Dashboard";
// import UserProfile from "views/UserProfile/UserProfile.js";
import Projects from "./projects";
import ProjectRouting from './project'
import Devices from './devices'
import DeviceRouting from './device'
import Users from './users'
import UserRouting from './user'
import OrgRouting from './org'
import Orgs from './orgs'
import { Dashboard, LibraryBooks, Devices as DeviceIco, SettingsRounded, People } from "@material-ui/icons";
import NotFound from "layouts/404/NotFound";
// import UserProfile from 'views/UserProfile/UserProfile';
import Settings from 'views/Settings/Settings';

const dashboardRoutes = [
	{
		path: "/dashboard",
		sidebarName: "sidebar.dashboard", //Replace with translation.id
		navbarName: "Senti Dashboard",
		icon: Dashboard,
		component: DashboardPage,
		menuRoute: "dashboard"
	},
	{
		path: "/project/:id",
		component: ProjectRouting,
		hideFromSideBar: true,
		menuRoute: "projects"
	},
	{
		path: "/projects",
		sidebarName: "sidebar.projects",
		icon: LibraryBooks,
		component: Projects,
		menuRoute: "projects"
	},
	{
		path: "/device/:id",
		component: DeviceRouting,
		hideFromSideBar: true,
		menuRoute: "devices"
	},
	{
		path: "/devices",
		sidebarName: "sidebar.devices",
		icon: DeviceIco,
		component: Devices,
		menuRoute: "devices"
	},
	{
		path: "/users",
		sidebarName: "sidebar.users",
		icon: People,
		component: Users,
		menuRoute: "users"
	},
	{
		path: "/user/:id",
		component: UserRouting,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/orgs",
		component: Orgs,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/org/:id",
		component: OrgRouting,
		hideFromSideBar: true,
		menuRoute: "users"
	},
	{
		path: "/settings",
		sidebarName: "sidebar.settings",
		icon: SettingsRounded,
		component: Settings,
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
