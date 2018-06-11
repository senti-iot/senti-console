import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";

import {
	Dashboard,
	Person,
	ContentPaste,
	LibraryBooks,
	BubbleChart
} from "@material-ui/icons";
import Projekter from "../views/Projekter/Projekter";

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
	// {
	// 	path: "/enheder",
	// 	sidebarName: "Enheder",
	// 	navbarName: "Enheder",
	// 	icon: ContentPaste,
	// 	component: TableList
	// },
	{
		path: "/projekter",
		sidebarName: "Projekter",
		navbarName: "Projekter",
		icon: LibraryBooks,
		component: Projekter
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
