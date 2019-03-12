import Dashboard from 'layouts/Dashboard/Dashboard.js';
import ConfirmUser from 'layouts/ConfirmUser/ConfirmUser'
import ResetPassword from 'layouts/ResetPassword/ResetPassword';
import LoginPage from 'layouts/Login/LoginPage'

const indexRoutes = [
	{ path: '/login', component: LoginPage },
	{ path: '/password/confirm/:lang/:token', component: ConfirmUser },
	{ path: '/password/reset/:lang/:token?', component: ResetPassword },
	
	{ path: '/', component: Dashboard },
];

export default indexRoutes;
