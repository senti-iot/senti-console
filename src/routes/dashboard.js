import React from 'react';
import { Redirect } from 'react-router-dom'
import DashboardPage from "views/Dashboard/Dashboard.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
import Typography from "views/Typography/Typography.js";
import Projects from "views/Projects/Projects";

import {
	Dashboard,
	// Person,
	LibraryBooks,
	// BubbleChart,
	Devices,
	Settings,
	People
} from "@material-ui/icons";
import Project from "views/Projects/Project";

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
		sidebarName: "Project",
		icon: LibraryBooks,
		component: Project,
		hideFromSideBar: true
	},
	{
		path: "/projects",
		sidebarName: "Projects",
		icon: LibraryBooks,
		component: Projects
	},
	{
		path: "/devices",
		sidebarName: "Devices",
		icon: Devices,
		component: DashboardPage
	},
	{
		path: "/users",
		sidebarName: "Users",
		icon: People,
		component: Typography
	},
	{
		path: "/settings",
		sidebarName: "Settings",
		icon: Settings,
		component: DashboardPage
	},
	{
		path: "/404",
		sidebarName: "Error",
		component: DashboardPage,
		hideFromSideBar: true
	},

	{
		path: "*",
		component: () => <Redirect from={window.location.pathname} to={window.location.pathname === '/' ? '/dashboard' : '/404'} />,
		hideFromSideBar: true
	},


];

export default dashboardRoutes;
