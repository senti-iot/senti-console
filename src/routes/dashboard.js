import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from "views/Dashboard/Dashboard.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
import Projects from "./projects";
import ProjectRouting from './project'
import Devices from './devices'
import DeviceRouting from './device'
import { Dashboard, LibraryBooks, Devices as DeviceIco, SettingsRounded, People } from "@material-ui/icons";
import NotFound from "layouts/404/NotFound";
import UserProfile from 'views/UserProfile/UserProfile';


const dashboardRoutes = [
	{
		path: "/dashboard",
		sidebarName: "Dashboard",
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
		sidebarName: "Projects",
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
		sidebarName: "Devices",
		icon: DeviceIco,
		component: Devices
	},
	{
		path: "/users",
		sidebarName: "Users",
		icon: People,
		component: UserProfile
	},
	{
		path: "/settings",
		sidebarName: "Settings",
		icon: SettingsRounded,
		component: DashboardPage
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
