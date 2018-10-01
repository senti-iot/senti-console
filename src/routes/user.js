
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import User from 'views/Users/User';
import EditUser from 'components/User/EditUser';


export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={(rp) => <EditUser {...rp} {...props}/>} />
			<Route path={`${props.match.url}`} render={() => <User {...props} />} /> 
		</Switch>
	)
}))