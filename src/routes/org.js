
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
import withLocalization from 'components/Localization/T';
import Org from 'views/Orgs/Org';
import EditOrg from '../components/Orgs/EditOrg'


export default withRouter(withLocalization()((props) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/edit`} render={() => <EditOrg {...props}/>}/>
			<Route path={`${props.match.url}`} render={() => <Org {...props} />} /> 
		</Switch>
	)
}))