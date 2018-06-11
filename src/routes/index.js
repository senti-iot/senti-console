import Dashboard from "layouts/Dashboard/Dashboard.js";
import LoginPage from "views/LoginPage/LoginPage";

const indexRoutes = [
	{ path: "/login", component: LoginPage },
	{ path: "/", component: Dashboard },
];
export default indexRoutes;
