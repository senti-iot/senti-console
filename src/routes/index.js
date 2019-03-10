import Dashboard from 'layouts/Dashboard/Dashboard.js';
import ConfirmUser from 'layouts/ConfirmUser/ConfirmUser'
import ResetPassword from 'layouts/ResetPassword/ResetPassword';
import NewLoginPage from 'layouts/Login/NewLoginPage'

const indexRoutes = [
	{ path: '/login', component: NewLoginPage },
	{ path: '/password/confirm/:lang/:token', component: ConfirmUser },
	{ path: '/password/reset/:lang/:token?', component: ResetPassword },
	
	{ path: '/', component: Dashboard },
];

export default indexRoutes;
