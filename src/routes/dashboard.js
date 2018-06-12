import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Typography from "views/Typography/Typography.js";
import Projects from "views/Projects/Projects";

import {
	Dashboard,
	Person,
	LibraryBooks,
	BubbleChart
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
		path: "/user",
		sidebarName: "User Profile",
		navbarName: "Profile",
		icon: Person,
		component: UserProfile
	},
	{
		path: "/project/:id",
		sidebarName: "Project",
		navbarName: "Project",
		icon: LibraryBooks,
		component: Project,
		hideFromSideBar: true
	},
	{
		path: "/projects",
		sidebarName: "Project",
		navbarName: "Project",
		icon: LibraryBooks,
		component: Projects
	},
	{
		path: "/management",
		sidebarName: "Management",
		navbarName: "Manangement",
		icon: BubbleChart,
		component: Typography
	},
	{ redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
