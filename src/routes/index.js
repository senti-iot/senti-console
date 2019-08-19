// import React from 'react'
import Dashboard from 'layouts/Dashboard/Dashboard.js';
import ConfirmUser from 'layouts/ConfirmUser/ConfirmUser'
import ResetPassword from 'layouts/ResetPassword/ResetPassword';
import LoginPage from 'layouts/Login/LoginPageH'
import OutlinedInputAdornments from 'layouts/Login/Test'
// import PrivacyDialog from 'components/Cookies/PrivacyDialog';
import PrivacyPolicy from 'layouts/Privacy/Privacy';
const indexRoutes = [
	{ path: '/login', component: LoginPage },
	{ path: '/password/confirm/:lang/:token', component: ConfirmUser },
	{ path: '/test', component: OutlinedInputAdornments },
	{ path: '/password/reset/:lang/:token?', component: ResetPassword },
	{ path: '/privacy-policy', component: PrivacyPolicy },

	{ path: '/', component: Dashboard },
];

export default indexRoutes;
