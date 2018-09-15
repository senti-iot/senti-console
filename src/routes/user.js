
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import User from 'views/Users/User';


export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}`} render={() => <User {...props} />} /> 
		</Switch>
	)
}))