import React from 'react'
import cookie from 'react-cookies'
import Dashboard from "layouts/Dashboard/Dashboard.js";
import LoginPage from "layouts/Login/LoginPage";
import ConfirmUser from "layouts/ConfirmUser/ConfirmUser"
import ResetPassword from 'layouts/ResetPassowrd/ResetPassword';
const CookiePage = () => {
	console.log(cookie.loadAll())
	let SessionCookie = cookie.load("SESSION")
	return <div>
		{JSON.stringify(SessionCookie)}
	</div>
}
const indexRoutes = [
	{ path: "/cookies", component: CookiePage },
	{ path: "/login", component: LoginPage },
	{ path: "/password/confirm/:lang/:token", component: ConfirmUser },
	{ path: "/password/reset/:lang/:token?", component: ResetPassword },
	{ path: "/", component: Dashboard },
];
export default indexRoutes;
