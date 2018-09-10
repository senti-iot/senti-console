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
		component: DashboardPage
	},
	{
		path: "/project/:id",
		component: ProjectRouting,
		hideFromSideBar: true
	},
	{
		path: "/projects",
		sidebarName: "sidebar.projects",
		icon: LibraryBooks,
		component: Projects
	},
	{
		path: "/device/:id",
		component: DeviceRouting,
		hideFromSideBar: true
	},
	{
		path: "/devices",
		sidebarName: "sidebar.devices",
		icon: DeviceIco,
		component: Devices
	},
	{
		path: "/users",
		sidebarName: "sidebar.users",
		icon: People,
		component: Users
	},
	{
		path: "/user/:id",
		component: UserRouting,
		hideFromSideBar: true
	},
	{
		path: "/settings",
		sidebarName: "sidebar.settings",
		icon: SettingsRounded,
		component: Settings
	},
	{
		path: "/404",
		sidebarName: "Error",
		component: NotFound,
		hideFromSideBar: true
	},
	{
		path: "*",
		component: () => <Redirect from={window.location.pathname} to={window.location.pathname === '/' ? '/dashboard' : '/404'} />,
		hideFromSideBar: true
	},


];

export default dashboardRoutes;
