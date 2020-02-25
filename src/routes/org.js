
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Org from 'views/Orgs/Org';
import EditOrg from 'components/Orgs/EditOrg'


const org = (props) => {
	return (
		<Switch>
			<Route path={`${props.path}/edit`}>
				<EditOrg {...props} />
			</Route>
			<Route path={`${props.path}`}>
				<Org {...props} />
			</Route>
		</Switch>
	)
}

export default org