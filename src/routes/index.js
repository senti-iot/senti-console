import Dashboard from "layouts/Dashboard/Dashboard.js";
import LoginPage from "layouts/Login/LoginPage";

const indexRoutes = [
	{ path: "/login", component: LoginPage },
	{ path: "/", component: Dashboard },
];
export default indexRoutes;
